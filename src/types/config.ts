export interface ExplainThisProjectConfig {
	includeDevDependencies: boolean;
	maxDirectoryDepth: number;
	excludeDirectories: string[];
	openaiApiKey: string;
	llmProvider: LLMProviderType;
	includeGitAnalysis: boolean;
}

export type LLMProviderType = 'copilot' | 'openai' | 'claude' | 'anthropic';
