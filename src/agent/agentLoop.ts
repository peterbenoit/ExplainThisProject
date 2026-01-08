import * as vscode from 'vscode';
import { ConfigurationService } from '../services/configurationService';
import { UserInterfaceService } from '../services/userInterfaceService';
import { ProjectOverviewService } from '../services/projectOverviewService';
import { AgentOrchestrator } from '../services/agentOrchestrator';
import { askLLM } from './llm';

export async function runAgent(rootPath: string): Promise<void> {
	// Create service instances
	const configService = new ConfigurationService(vscode);
	const uiService = new UserInterfaceService(vscode);
	const overviewService = new ProjectOverviewService();
	const llmProvider = { askLLM };

	// Create orchestrator
	const orchestrator = new AgentOrchestrator(
		llmProvider,
		uiService,
		configService,
		overviewService
	);

	// Start agent session
	await orchestrator.startSession(rootPath);
}