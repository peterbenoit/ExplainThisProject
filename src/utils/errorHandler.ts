import * as vscode from 'vscode';
import { ExplainThisProjectError, ErrorContext } from '../errors';
import { ErrorCode } from '../types/errors';

export function handleError(error: unknown, operation: string, context?: ErrorContext): ExplainThisProjectError {
	if (error instanceof ExplainThisProjectError) {
		return error;
	}
	
	if (error instanceof Error) {
		return new ExplainThisProjectError(
			`${operation} failed: ${error.message}`,
			ErrorCode.FILE_SYSTEM_ERROR,
			{ ...context, operation, additionalInfo: { ...context?.additionalInfo, originalError: error } }
		);
	}
	
	return new ExplainThisProjectError(
		`${operation} failed: Unknown error`,
		ErrorCode.FILE_SYSTEM_ERROR,
		{ ...context, operation }
	);
}

export function showErrorToUser(error: ExplainThisProjectError): void {
	const operation = error.context?.operation || 'Operation';
	const message = `${operation} failed: ${error.message}`;
	vscode.window.showErrorMessage(message);
}

export function logError(error: ExplainThisProjectError): void {
	const timestamp = new Date().toISOString();
	const logMessage = `[${timestamp}] ${error.code}: ${error.message}`;
	
	if (error.context) {
		console.error(logMessage, error.context);
	} else {
		console.error(logMessage);
	}
}

export async function handleAndShowError(error: unknown, operation: string, context?: ErrorContext): Promise<void> {
	const handledError = handleError(error, operation, context);
	logError(handledError);
	showErrorToUser(handledError);
}