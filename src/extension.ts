import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { analyzeProject } from "./runner/projectAnalysis";
import { renderProjectOverview } from "./runner/renderMarkdown";
import { runAgent } from "./agent/agentLoop";

export function activate(context: vscode.ExtensionContext) {

	// Helper function for the core analysis logic
	const performAnalysis = async (forceOverwrite: boolean = false) => {
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

				// Check if PROJECT_OVERVIEW.md already exists
				const overviewPath = path.join(root, "PROJECT_OVERVIEW.md");
				let shouldWrite = true;

				if (fs.existsSync(overviewPath) && !forceOverwrite) {
					// File exists, ask user what to do
					const choice = await vscode.window.showWarningMessage(
						"PROJECT_OVERVIEW.md already exists. What would you like to do?",
						{
							modal: true,
							detail: "This will replace the existing file. Make sure to backup any important content first."
						},
						"Overwrite",
						"Create Backup & Overwrite",
						"Save as New File",
						"Cancel"
					);

					switch (choice) {
						case "Overwrite":
							shouldWrite = true;
							break;
						case "Create Backup & Overwrite":
							// Create backup with timestamp
							const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
							const backupPath = path.join(root, `PROJECT_OVERVIEW.backup.${timestamp}.md`);
							fs.copyFileSync(overviewPath, backupPath);
							vscode.window.showInformationMessage(`Backup created: ${path.basename(backupPath)}`);
							shouldWrite = true;
							break;
						case "Save as New File":
							// Let user choose filename
							const newUri = await vscode.window.showSaveDialog({
								defaultUri: vscode.Uri.file(path.join(root, "PROJECT_OVERVIEW_NEW.md")),
								filters: {
									'Markdown': ['md']
								}
							});
							if (newUri) {
								fs.writeFileSync(newUri.fsPath, markdownContent, "utf8");
								const action = await vscode.window.showInformationMessage(
									`Project overview saved as ${path.basename(newUri.fsPath)}`,
									"Open File"
								);
								if (action === "Open File") {
									const document = await vscode.workspace.openTextDocument(newUri);
									await vscode.window.showTextDocument(document);
								}
							}
							shouldWrite = false;
							break;
						case "Cancel":
						default:
							shouldWrite = false;
							break;
					}
				}

				if (shouldWrite) {
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
				} else {
					progress.report({ increment: 100, message: "Cancelled." });
				}
			});

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
			vscode.window.showErrorMessage(`Failed to generate project overview: ${errorMessage}`);
		}
	};

	// Register the main command
	const disposable1 = vscode.commands.registerCommand(
		"explain-this-project.explainProject",
		() => performAnalysis(false)
	);

	// Register the force overwrite command
	const disposable2 = vscode.commands.registerCommand(
		"explain-this-project.explainProjectForceOverwrite",
		() => performAnalysis(true)
	);

	// Register the ask questions command
	const disposable3 = vscode.commands.registerCommand(
		"explain-this-project.askQuestions",
		() => {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders || workspaceFolders.length === 0) {
				vscode.window.showErrorMessage("No workspace folder is open. Open a project folder first.");
				return;
			}
			runAgent(workspaceFolders[0].uri.fsPath);
		}
	);

	context.subscriptions.push(disposable1, disposable2, disposable3);
}

export function deactivate() { }
