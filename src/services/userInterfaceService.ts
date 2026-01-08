import * as vscode from 'vscode';

export interface IUserInterfaceService {
	showInputBox(options: vscode.InputBoxOptions): Promise<string | undefined>;
	showProgress<T>(options: vscode.ProgressOptions, task: (progress: vscode.Progress<{ message?: string; increment?: number }>) => Promise<T>): Promise<T>;
	showErrorMessage(message: string): Promise<void>;
	showWarningMessage(message: string, actions?: string[]): Promise<string | undefined>;
	showInformationMessage(message: string, actions?: string[]): Promise<string | undefined>;
	createOutputChannel(name: string): vscode.OutputChannel;
}

export class UserInterfaceService implements IUserInterfaceService {
	constructor(private vscodeAPI: typeof vscode) {}

	async showInputBox(options: vscode.InputBoxOptions): Promise<string | undefined> {
		return this.vscodeAPI.window.showInputBox(options);
	}

	async showProgress<T>(options: vscode.ProgressOptions, task: (progress: vscode.Progress<{ message?: string; increment?: number }>) => Promise<T>): Promise<T> {
		return this.vscodeAPI.window.withProgress(options, task);
	}

	async showErrorMessage(message: string): Promise<void> {
		await this.vscodeAPI.window.showErrorMessage(message);
	}

	async showWarningMessage(message: string, actions?: string[]): Promise<string | undefined> {
		return this.vscodeAPI.window.showWarningMessage(message, ...actions || []);
	}

	async showInformationMessage(message: string, actions?: string[]): Promise<string | undefined> {
		return this.vscodeAPI.window.showInformationMessage(message, ...actions || []);
	}

	createOutputChannel(name: string): vscode.OutputChannel {
		return this.vscodeAPI.window.createOutputChannel(name);
	}
}