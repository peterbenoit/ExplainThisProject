import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function getWorkspaceRoot(): string | null {
	const folders = vscode.workspace.workspaceFolders;
	if (!folders || folders.length === 0) {
		return null;
	}
	return folders[0].uri.fsPath;
}

export function listFiles(dir: string, depth = 3): string[] {
	if (depth < 0) return [];
	let result: string[] = [];

	for (const entry of fs.readdirSync(dir)) {
		const fullPath = path.join(dir, entry);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			// Ignore heavy or irrelevant directories
			if (["node_modules", ".git", "dist", "build"].includes(entry)) continue;
			result = result.concat(listFiles(fullPath, depth - 1));
		} else {
			result.push(fullPath);
		}
	}

	return result;
}

export function readFile(filePath: string): string {
	return fs.readFileSync(filePath, "utf8");
}
