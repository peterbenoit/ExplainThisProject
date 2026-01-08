export interface ExplainThisProjectConfig {
	includeDevDependencies: boolean;
	maxDirectoryDepth: number;
	excludeDirectories: string[];
	openaiApiKey: string;
	llmProvider: LLMProviderType;
}

export type LLMProviderType = 'openai' | 'claude' | 'anthropic';

export interface ConfigValidationError {
	field: keyof ExplainThisProjectConfig;
	message: string;
	value: unknown;
}

import * as vscode from 'vscode';

export function getConfig(): ExplainThisProjectConfig {
	const config = vscode.workspace.getConfiguration('explainThisProject');
	return {
		includeDevDependencies: config.get('includeDevDependencies', true),
		maxDirectoryDepth: config.get('maxDirectoryDepth', 3),
		excludeDirectories: config.get('excludeDirectories', []),
		openaiApiKey: config.get('openaiApiKey', ''),
		llmProvider: config.get('llmProvider', 'openai')
	};
}

export function validateConfig(config: ExplainThisProjectConfig): ConfigValidationError[] {
	const errors: ConfigValidationError[] = [];
	
	if (!config.openaiApiKey.trim()) {
		errors.push({
			field: 'openaiApiKey',
			message: 'API key is required',
			value: config.openaiApiKey
		});
	}
	
	if (config.maxDirectoryDepth < 1 || config.maxDirectoryDepth > 10) {
		errors.push({
			field: 'maxDirectoryDepth',
			message: 'Depth must be between 1 and 10',
			value: config.maxDirectoryDepth
		});
	}
	
	return errors;
}