import * as vscode from 'vscode';
import OpenAI from 'openai';

export interface LLMProvider {
	askLLM(context: string, question: string): Promise<string>;
}

class CopilotProvider implements LLMProvider {
	async askLLM(context: string, question: string): Promise<string> {
		const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
		if (models.length === 0) {
			throw new Error('No Copilot model available. Please ensure GitHub Copilot is installed and you are signed in.');
		}

		const model = models[0];
		const messages = [
			vscode.LanguageModelChatMessage.User(
				`You are a project explainer. Answer questions accurately based only on the provided project summary. Do not make assumptions or hallucinate.

PROJECT SUMMARY:
${context}

QUESTION:
${question}

ANSWER:`
			)
		];

		try {
			const response = await model.sendRequest(messages, {});
			let result = '';
			for await (const chunk of response.text) {
				result += chunk;
			}
			return result.trim() || "I couldn't generate a response. Please try again.";
		} catch (error) {
			if (error instanceof vscode.LanguageModelError) {
				throw new Error(`Copilot error: ${error.message}`);
			}
			throw error;
		}
	}
}

class OpenAIProvider implements LLMProvider {
	private client: OpenAI | null = null;

	private getClient(): OpenAI {
		if (!this.client) {
			const apiKey = vscode.workspace.getConfiguration('explainThisProject').get<string>('openaiApiKey');
			if (!apiKey || apiKey.trim() === '') {
				throw new Error('OpenAI API key not configured. Please set it in VS Code settings (explainThisProject.openaiApiKey).');
			}
			this.client = new OpenAI({
				apiKey: apiKey.trim()
			});
		}
		return this.client;
	}

	async askLLM(context: string, question: string): Promise<string> {
		const client = this.getClient();

		const prompt = `You are a project explainer. Do not guess or hallucinate.
Answer only based on the provided project summary.

PROJECT SUMMARY:
${context}

QUESTION:
${question}

ANSWER:`;

		try {
			const completion = await client.chat.completions.create({
				model: "gpt-4o-mini",
				messages: [
					{
						role: "system",
						content: "You are a helpful project explanation assistant. Answer questions accurately based only on the provided project summary. Do not make assumptions or provide information not contained in the summary."
					},
					{
						role: "user",
						content: prompt
					}
				],
				max_tokens: 1000,
				temperature: 0.1
			});

			return completion.choices[0]?.message?.content?.trim() || "I couldn't generate a response. Please try again.";
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes('API key')) {
					throw new Error('OpenAI API key is invalid. Please check your API key in VS Code settings.');
				}
				throw new Error(`OpenAI API error: ${error.message}`);
			} else {
				throw new Error('Unknown error occurred while calling OpenAI API.');
			}
		}
	}
}

// Factory function to get the appropriate LLM provider
export function getLLMProvider(): LLMProvider {
	const provider = vscode.workspace.getConfiguration('explainThisProject').get<string>('llmProvider', 'copilot');

	switch (provider) {
		case 'copilot':
			return new CopilotProvider();
		case 'openai':
			return new OpenAIProvider();
		default:
			throw new Error(`Unsupported LLM provider: ${provider}`);
	}
}

// Main function to ask the LLM a question
export async function askLLM(context: string, question: string): Promise<string> {
	const provider = getLLMProvider();
	return provider.askLLM(context, question);
}

// Generate a narrative AI summary of the project overview
export async function generateAiSummary(
	markdownOverview: string,
	token?: vscode.CancellationToken,
	timeoutMs: number = 30000
): Promise<string | null> {
	try {
		const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
		if (models.length === 0) { return null; }
		if (token?.isCancellationRequested) { return null; }

		const model = models[0];
		const messages = [
			vscode.LanguageModelChatMessage.User(
				`You are a senior software engineer reviewing a project for a new team member.

Based on the structured project data below, write a concise narrative summary (3-5 paragraphs) that covers:
1. What this project is and what it does
2. The technology stack and key architectural choices
3. Any notable patterns, frameworks, or dependencies worth highlighting
4. How a developer would get started

Be specific and factual. Only use information present in the data. Do not invent details.

PROJECT DATA:
${markdownOverview}

Write the summary in plain markdown paragraphs with no extra headings.`
			)
		];

		// Race the LLM stream against a timeout and cancellation
		const streamResult = model.sendRequest(messages, {}, token);

		const summaryPromise = (async () => {
			const response = await streamResult;
			let result = '';
			for await (const chunk of response.text) {
				if (token?.isCancellationRequested) { return null; }
				result += chunk;
			}
			return result.trim() || null;
		})();

		const timeoutPromise = new Promise<null>(resolve =>
			setTimeout(() => resolve(null), timeoutMs)
		);

		return await Promise.race([summaryPromise, timeoutPromise]);
	} catch {
		// AI summary is best-effort — never fail the whole operation
		return null;
	}
}
