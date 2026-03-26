import * as vscode from 'vscode';
import { ExplainThisProjectConfig } from '../types/config';

export interface IConfigurationService {
	getApiKey(): string | null;
	getLLMProvider(): string;
	validateApiKey(): Promise<boolean>;
	getConfig(): ExplainThisProjectConfig;
}

export class ConfigurationService implements IConfigurationService {
	constructor(private vscodeAPI: typeof vscode) { }

	getConfig(): ExplainThisProjectConfig {
		const config = this.vscodeAPI.workspace.getConfiguration('explainThisProject');
		return {
			includeDevDependencies: config.get('includeDevDependencies', true),
			maxDirectoryDepth: config.get('maxDirectoryDepth', 3),
			excludeDirectories: config.get('excludeDirectories', []),
			openaiApiKey: config.get('openaiApiKey', ''),
			llmProvider: config.get('llmProvider', 'copilot')
		};
	}

	getApiKey(): string | null {
		const config = this.getConfig();
		return config.openaiApiKey.trim() || null;
	}

	getLLMProvider(): string {
		const config = this.getConfig();
		return config.llmProvider;
	}

	async validateApiKey(): Promise<boolean> {
		// Copilot uses vscode.lm and requires no API key
		if (this.getLLMProvider() === 'copilot') {
			return true;
		}
		const apiKey = this.getApiKey();
		if (!apiKey) {
			return false;
		}
		return apiKey.startsWith('sk-') && apiKey.length > 20;
	}
}
