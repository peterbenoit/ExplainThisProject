import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { analyzeProject } from "./runner/projectAnalysis";
import { renderProjectOverview } from "./runner/renderMarkdown";

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand(
		"explain-this-project.explainProject",
		async () => {

			// Ensure a folder is open
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders || workspaceFolders.length === 0) {
				vscode.window.showErrorMessage("No workspace folder is open. Open a project folder first.");
				return;
			}

			const root = workspaceFolders[0].uri.fsPath;

			try {
				// Show progress indicator
				await vscode.window.withProgress({
					location: vscode.ProgressLocation.Notification,
					title: "Analyzing project...",
					cancellable: false
				}, async (progress) => {
					progress.report({ increment: 0 });

					// Run analysis
					progress.report({ increment: 50, message: "Scanning files and dependencies..." });
					const overview = analyzeProject(root);

					// Generate markdown content
					progress.report({ increment: 80, message: "Generating overview..." });
					const markdownContent = renderProjectOverview(overview);

					// Write to PROJECT_OVERVIEW.md
					const overviewPath = path.join(root, "PROJECT_OVERVIEW.md");
					fs.writeFileSync(overviewPath, markdownContent, "utf8");

					progress.report({ increment: 100, message: "Complete!" });

					// Show success message and offer to open the file
					const action = await vscode.window.showInformationMessage(
						`Project overview generated successfully in PROJECT_OVERVIEW.md`,
						"Open File"
					);

					if (action === "Open File") {
						const document = await vscode.workspace.openTextDocument(overviewPath);
						await vscode.window.showTextDocument(document);
					}

					// Also show brief summary in output channel
					const output = vscode.window.createOutputChannel("Explain This Project");
					output.clear();
					output.appendLine("✅ PROJECT OVERVIEW GENERATED");
					output.appendLine("────────────────────────────────────────");
					output.appendLine(`📄 File: PROJECT_OVERVIEW.md`);
					output.appendLine(`📁 Project: ${overview.projectName ?? "Unknown"}`);
					output.appendLine(`🏷️  Type: ${overview.projectType ?? "Unknown"}`);
					output.appendLine(`💻 Language: ${overview.primaryLanguage ?? "Unknown"}`);
					if (overview.frameworks.length > 0) {
						output.appendLine(`🔧 Frameworks: ${overview.frameworks.join(", ")}`);
					}
					output.appendLine("");
					output.appendLine("Open PROJECT_OVERVIEW.md to see the full analysis.");
				});

			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
				vscode.window.showErrorMessage(`Failed to generate project overview: ${errorMessage}`);
			}
		}
	);

	context.subscriptions.push(disposable);
}

export function deactivate() { }
