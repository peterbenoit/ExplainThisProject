import { ErrorCode, ErrorContext } from './types/errors';

export { ErrorContext };

export class ExplainThisProjectError extends Error {
	constructor(
		message: string,
		public readonly code: ErrorCode,
		public readonly context?: ErrorContext
	) {
		super(message);
		this.name = 'ExplainThisProjectError';
	}
}

export class FileSystemError extends ExplainThisProjectError {
	constructor(operation: string, filePath: string, cause?: Error) {
		super(
			`File system error during ${operation}: ${cause?.message || 'Unknown error'}`,
			ErrorCode.FILE_SYSTEM_ERROR,
			{ operation, filePath, additionalInfo: { originalError: cause } }
		);
		this.name = 'FileSystemError';
	}
}

export class LLMError extends ExplainThisProjectError {
	constructor(operation: string, cause?: Error) {
		super(
			`LLM error during ${operation}: ${cause?.message || 'Unknown error'}`,
			ErrorCode.API_ERROR,
			{ operation, additionalInfo: { originalError: cause } }
		);
		this.name = 'LLMError';
	}
}

export class ConfigurationError extends ExplainThisProjectError {
	constructor(message: string, field?: string) {
		super(
			message,
			ErrorCode.CONFIGURATION_ERROR,
			{ operation: 'configuration', additionalInfo: { field } }
		);
		this.name = 'ConfigurationError';
	}
}

export class ProjectAnalysisError extends ExplainThisProjectError {
	constructor(message: string, projectPath?: string) {
		super(
			message,
			ErrorCode.PROJECT_ANALYSIS_ERROR,
			{ operation: 'project analysis', additionalInfo: { projectPath } }
		);
		this.name = 'ProjectAnalysisError';
	}
}

export class WorkspaceError extends ExplainThisProjectError {
	constructor(message: string) {
		super(
			message,
			ErrorCode.WORKSPACE_ERROR,
			{ operation: 'workspace access' }
		);
		this.name = 'WorkspaceError';
	}
}