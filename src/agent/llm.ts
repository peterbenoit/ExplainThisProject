import * as vscode from 'vscode';
import OpenAI from 'openai';

export interface LLMProvider {
	askLLM(context: string, question: string): Promise<string>;
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
	const provider = vscode.workspace.getConfiguration('explainThisProject').get<string>('llmProvider', 'openai');

	switch (provider) {
		case 'openai':
			return new OpenAIProvider();
		// Future providers can be added here:
		// case 'claude':
		//     return new ClaudeProvider();
		default:
			throw new Error(`Unsupported LLM provider: ${provider}`);
	}
}

// Main function to ask the LLM a question
export async function askLLM(context: string, question: string): Promise<string> {
	const provider = getLLMProvider();
	return provider.askLLM(context, question);
}
