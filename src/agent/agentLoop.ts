import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { analyzeProject } from '../runner/projectAnalysis';
import { renderProjectOverview } from '../runner/renderMarkdown';
import { askLLM } from './llm';

export async function runAgent(rootPath: string): Promise<void> {
	const overviewPath = path.join(rootPath, 'PROJECT_OVERVIEW.md');

	// Ensure PROJECT_OVERVIEW.md exists
	let projectOverviewContent: string;
	if (!fs.existsSync(overviewPath)) {
		try {
			// Generate the project overview if it doesn't exist
			await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Generating project overview for agent...",
				cancellable: false
			}, async (progress) => {
				progress.report({ increment: 50, message: "Analyzing project..." });
				const overview = analyzeProject(rootPath);

				progress.report({ increment: 80, message: "Rendering overview..." });
				projectOverviewContent = renderProjectOverview(overview);

				fs.writeFileSync(overviewPath, projectOverviewContent, 'utf8');
				progress.report({ increment: 100, message: "Overview generated!" });
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
			vscode.window.showErrorMessage(`Failed to generate project overview: ${errorMessage}`);
			return;
		}
	} else {
		// Read existing overview
		try {
			projectOverviewContent = fs.readFileSync(overviewPath, 'utf8');
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to read PROJECT_OVERVIEW.md: ${error instanceof Error ? error.message : 'Unknown error'}`);
			return;
		}
	}

	// Create and show the output channel for chat
	const outputChannel = vscode.window.createOutputChannel("Explain This Project: Chat");
	outputChannel.clear();
	outputChannel.appendLine("🤖 Explain This Project Agent");
	outputChannel.appendLine("════════════════════════════════");
	outputChannel.appendLine("Ask questions about your project based on the PROJECT_OVERVIEW.md analysis.");
	outputChannel.appendLine("The agent will only answer based on the project summary, without hallucination.");
	outputChannel.appendLine("");
	outputChannel.show(true);

	// Check API key configuration
	const apiKey = vscode.workspace.getConfiguration('explainThisProject').get<string>('openaiApiKey');
	if (!apiKey || apiKey.trim() === '') {
		const action = await vscode.window.showWarningMessage(
			'OpenAI API key is not configured. Please set it in VS Code settings to use the agent.',
			{
				modal: false,
				detail: 'Go to Settings > Extensions > Explain This Project > Openai Api Key'
			},
			'Open Settings'
		);

		if (action === 'Open Settings') {
			vscode.commands.executeCommand('workbench.action.openSettings', 'explainThisProject.openaiApiKey');
		}
		return;
	}

	// Start the interactive loop
	let isFirstQuestion = true;
	while (true) {
		const question = await vscode.window.showInputBox({
			prompt: isFirstQuestion
				? "Ask your first question about the project (or press Esc to exit)"
				: "Ask another question about the project (or press Esc to exit)",
			placeHolder: "e.g., What does this project do? How do I run it? What are the main components?",
			ignoreFocusOut: true
		});

		// User cancelled or provided empty input
		if (!question || question.trim() === '') {
			outputChannel.appendLine("");
			outputChannel.appendLine("🔚 Agent session ended.");
			break;
		}

		isFirstQuestion = false;

		// Log the user's question
		outputChannel.appendLine(`> USER: ${question.trim()}`);
		outputChannel.appendLine("");

		try {
			// Show progress while calling LLM
			const response = await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Agent is thinking...",
				cancellable: false
			}, async (progress) => {
				progress.report({ increment: 0, message: "Sending question to LLM..." });

				const result = await askLLM(projectOverviewContent, question.trim());

				progress.report({ increment: 100, message: "Response received!" });
				return result;
			});

			// Log the agent's response
			outputChannel.appendLine(`> AGENT: ${response}`);
			outputChannel.appendLine("");
			outputChannel.appendLine("────────────────────────────────");
			outputChannel.appendLine("");

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			outputChannel.appendLine(`> AGENT: ❌ Error: ${errorMessage}`);
			outputChannel.appendLine("");
			outputChannel.appendLine("────────────────────────────────");
			outputChannel.appendLine("");

			// Show error to user but continue the loop
			vscode.window.showErrorMessage(`Agent error: ${errorMessage}`);
		}
	}
}
