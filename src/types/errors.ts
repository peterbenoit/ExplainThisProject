export interface ExtensionError {
	code: ErrorCode;
	message: string;
	details?: unknown;
	timestamp: Date;
}

export enum ErrorCode {
	CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
	API_ERROR = 'API_ERROR',
	FILE_SYSTEM_ERROR = 'FILE_SYSTEM_ERROR',
	PROJECT_ANALYSIS_ERROR = 'PROJECT_ANALYSIS_ERROR',
	WORKSPACE_ERROR = 'WORKSPACE_ERROR'
}

export interface ErrorContext {
	operation: string;
	filePath?: string;
	additionalInfo?: Record<string, unknown>;
}
