import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { FileSystemError } from "../errors";

export function getWorkspaceRoot(): string | null {
	const folders = vscode.workspace.workspaceFolders;
	if (!folders || folders.length === 0) {
		return null;
	}
	return folders[0]?.uri.fsPath ?? null;
}

export function listFiles(dir: string, depth = 3): string[] {
	if (depth < 0) {return [];}
	let result: string[] = [];

	try {
		for (const entry of fs.readdirSync(dir)) {
			const fullPath = path.join(dir, entry);
			try {
				const stat = fs.statSync(fullPath);

				if (stat.isDirectory()) {
					// Ignore heavy or irrelevant directories
					if (["node_modules", ".git", "dist", "build"].includes(entry)) {continue;}
					result = result.concat(listFiles(fullPath, depth - 1));
				} else {
					result.push(fullPath);
				}
			} catch (statError) {
				// Skip files that can't be accessed, but continue with others
				console.warn(`Skipping inaccessible file: ${fullPath}`);
			}
		}
	} catch (error) {
		throw new FileSystemError('list directory', dir, error as Error);
	}

	return result;
}

export function readFile(filePath: string): string {
	try {
		return fs.readFileSync(filePath, "utf8");
	} catch (error) {
		throw new FileSystemError('read file', filePath, error as Error);
	}
}
