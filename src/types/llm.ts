export interface LLMProvider {
	name: string;
	capabilities: LLMCapabilities;
	askLLM(request: LLMRequest): Promise<LLMResponse>;
	validateConfig(config: LLMConfig): ValidationResult;
}

export interface LLMCapabilities {
	maxTokens: number;
	supportedModels: string[];
	streamingSupport: boolean;
	systemPromptSupport: boolean;
}

export interface LLMRequest {
	context: string;
	question: string;
	model?: string;
	maxTokens?: number;
	temperature?: number;
}

export interface LLMResponse {
	content: string;
	model: string;
	tokensUsed: number;
	finishReason: 'stop' | 'length' | 'error';
}

export interface LLMConfig {
	apiKey: string;
	model?: string;
	maxTokens?: number;
	temperature?: number;
}

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}