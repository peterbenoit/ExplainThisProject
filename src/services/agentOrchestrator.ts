import * as vscode from 'vscode';
import { IConfigurationService } from './configurationService';
import { IUserInterfaceService } from './userInterfaceService';
import { IProjectOverviewService } from './projectOverviewService';
import { handleAndShowError } from '../utils/errorHandler';

export interface IAgentOrchestrator {
	startSession(rootPath: string): Promise<void>;
	processQuestion(question: string, context: string): Promise<string>;
	endSession(): void;
}

export class AgentOrchestrator implements IAgentOrchestrator {
	private outputChannel: vscode.OutputChannel;
	private isSessionActive = false;

	constructor(
		private llmProvider: { askLLM: (context: string, question: string) => Promise<string> },
		private uiService: IUserInterfaceService,
		private configService: IConfigurationService,
		private overviewService: IProjectOverviewService
	) {
		this.outputChannel = this.uiService.createOutputChannel("Explain This Project: Chat");
	}

	async startSession(rootPath: string): Promise<void> {
		if (this.isSessionActive) {
			await this.uiService.showErrorMessage('Agent session is already active');
			return;
		}

		try {
			// Validate configuration
			const isValid = await this.configService.validateApiKey();
			if (!isValid) {
				await this.handleMissingApiKey();
				return;
			}

			// Ensure project overview exists
			const overviewContent = await this.overviewService.ensureOverviewExists(rootPath);

			// Initialize output channel
			this.outputChannel.clear();
			this.outputChannel.appendLine("🤖 Explain This Project Agent");
			this.outputChannel.appendLine("════════════════════════════════");
			this.outputChannel.appendLine("Ask questions about your project based on PROJECT_OVERVIEW.md analysis.");
			this.outputChannel.appendLine("The agent will only answer based on project summary, without hallucination.");
			this.outputChannel.appendLine("");
			this.outputChannel.show(true);

			this.isSessionActive = true;
			await this.runQuestionLoop(overviewContent);

		} catch (error) {
			await handleAndShowError(error, 'AgentOrchestrator.startSession', { operation: 'startSession', additionalInfo: { rootPath } });
		}
	}

	async processQuestion(question: string, context: string): Promise<string> {
		try {
			return await this.uiService.showProgress(
				{
					location: 1, // vscode.ProgressLocation.Notification
					title: "Agent is thinking...",
					cancellable: false
				},
				async (progress) => {
					progress.report({ increment: 0, message: "Sending question to LLM..." });
					const result = await this.llmProvider.askLLM(context, question);
					progress.report({ increment: 100, message: "Response received!" });
					return result;
				}
			);
		} catch (error) {
			await handleAndShowError(error, 'AgentOrchestrator.processQuestion', { operation: 'processQuestion', additionalInfo: { question } });
			return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
		}
	}

	endSession(): void {
		if (this.isSessionActive) {
			this.outputChannel.appendLine("");
			this.outputChannel.appendLine("🔚 Agent session ended.");
			this.isSessionActive = false;
		}
	}

	private async runQuestionLoop(overviewContent: string): Promise<void> {
		let isFirstQuestion = true;

		while (this.isSessionActive) {
			const question = await this.uiService.showInputBox({
				prompt: isFirstQuestion
					? "Ask your first question about the project (or press Esc to exit)"
					: "Ask another question about the project (or press Esc to exit)",
				placeHolder: "e.g., What does this project do? How do I run it? What are the main components?",
				ignoreFocusOut: true
			});

			// User cancelled or provided empty input
			if (!question || question.trim() === '') {
				this.endSession();
				break;
			}

			isFirstQuestion = false;

			// Log the user's question
			this.outputChannel.appendLine(`> USER: ${question.trim()}`);
			this.outputChannel.appendLine("");

			// Process the question
			const response = await this.processQuestion(question.trim(), overviewContent);

			// Log the agent's response
			this.outputChannel.appendLine(`> AGENT: ${response}`);
			this.outputChannel.appendLine("");
			this.outputChannel.appendLine("────────────────────────────────");
			this.outputChannel.appendLine("");
		}
	}

	private async handleMissingApiKey(): Promise<void> {
		const action = await this.uiService.showWarningMessage(
			'OpenAI API key is not configured. Please set it in VS Code settings to use the agent.',
			['Open Settings']
		);

		if (action === 'Open Settings') {
			await this.uiService.executeCommand('workbench.action.openSettings', 'explainThisProject.openaiApiKey');
		}
	}
}
