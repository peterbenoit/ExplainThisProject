export interface ExtensionCommand {
	id: string;
	title: string;
	category: string;
	handler: (...args: any[]) => Promise<void>;
}

export interface CommandContext {
	workspaceRoot: string;
	config: import('./config').ExplainThisProjectConfig;
	outputChannel?: import('vscode').OutputChannel;
}

export interface AnalysisCommandOptions {
	forceOverwrite: boolean;
	outputPath?: string;
	createBackup?: boolean;
}