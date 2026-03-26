export interface ExplainThisProjectConfig {
	includeDevDependencies: boolean;
	maxDirectoryDepth: number;
	excludeDirectories: string[];
	openaiApiKey: string;
	llmProvider: LLMProviderType;
}

export type LLMProviderType = 'openai' | 'claude' | 'anthropic';
