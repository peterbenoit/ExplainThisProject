import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { analyzeProject } from "./runner/projectAnalysis";
import { renderProjectOverview } from "./runner/renderMarkdown";
import { runAgent } from "./agent/agentLoop";
import { generateAiSummary } from "./agent/llm";

export function activate(context: vscode.ExtensionContext): void {
	const outputChannel = vscode.window.createOutputChannel("Explain This Project");
	context.subscriptions.push(outputChannel);

	// Helper function for the core analysis logic
	const performAnalysis = async (forceOverwrite: boolean = false): Promise<void> => {
		// Ensure a folder is open
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length === 0) {
			vscode.window.showErrorMessage("No workspace folder is open. Open a project folder first.");
			return;
		}

		const root = workspaceFolders[0]?.uri.fsPath;
		if (!root) {
			vscode.window.showErrorMessage("Unable to determine workspace root path.");
			return;
		}

		try {
			// Show progress indicator
			let savedPath: string | null = null;
			let overview: any = null;
			await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Analyzing project...",
				cancellable: true
			}, async (progress, token) => {
				progress.report({ increment: 0 });

				// Run analysis
				progress.report({ increment: 10, message: "Scanning files and dependencies..." });
				const config = vscode.workspace.getConfiguration('explainThisProject');
				if (token.isCancellationRequested) { return; }
				overview = analyzeProject(root, {
					includeDevDependencies: config.get('includeDevDependencies', true),
					maxDirectoryDepth: config.get('maxDirectoryDepth', 3),
					excludeDirectories: config.get<string[]>('excludeDirectories', []),
					includeGitAnalysis: config.get('includeGitAnalysis', true),
					gitLogCallback: (msg: string) => outputChannel.appendLine(`   ${msg}`)
				});
				if (token.isCancellationRequested) { return; }

				// Log git analysis result for diagnostics
				outputChannel.clear();
				outputChannel.appendLine("🔍 ANALYSIS DIAGNOSTICS");
				outputChannel.appendLine("────────────────────────────────────────");
				outputChannel.appendLine(`📁 Root: ${root}`);
				if (overview.gitAnalysis) {
					outputChannel.appendLine(`✅ Git insights gathered:`);
					outputChannel.appendLine(`   Churn hotspots: ${overview.gitAnalysis.churnHotspots.length}`);
					outputChannel.appendLine(`   Bug clusters: ${overview.gitAnalysis.bugClusters.length}`);
					outputChannel.appendLine(`   Contributors: ${overview.gitAnalysis.topContributors.length}`);
					outputChannel.appendLine(`   Avg commits/month: ${overview.gitAnalysis.commitVelocity.averagePerMonth}`);
				} else {
					outputChannel.appendLine(`⚠️ Git insights not available (see details above)`);
				}
				outputChannel.show(true);

				// Generate the static markdown content
				progress.report({ increment: 50, message: "Rendering markdown..." });
				const staticMarkdown = renderProjectOverview(overview);
				if (token.isCancellationRequested) { return; }

				// Attempt AI narrative summary via Copilot (best-effort)
				const aiTimeoutMs = config.get<number>('aiSummaryTimeoutSeconds', 30) * 1000;
				progress.report({ increment: 70, message: "Generating AI summary (Cancel to skip)..." });
				const aiSummary = await generateAiSummary(staticMarkdown, token, aiTimeoutMs);
				if (token.isCancellationRequested) { return; }
				const aiSection = aiSummary
					? `## 🤖 AI Summary\n\n${aiSummary}\n\n---\n\n`
					: '';
				const markdownContent = staticMarkdown.replace(
					'# Project Overview\n',
					`# Project Overview\n\n${aiSection}`
				);

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
								savedPath = newUri.fsPath;
							}
							shouldWrite = false;
							break;
						case "Cancel":
						default:
							// User cancelled
							shouldWrite = false;
					}
				}

				if (shouldWrite) {
					fs.writeFileSync(overviewPath, markdownContent, "utf8");
					savedPath = overviewPath;
				}
			});

			// Small delay to let progress toast dismiss before showing success dialog
			if (savedPath) {
				await new Promise(resolve => setTimeout(resolve, 300));
				const action = await vscode.window.showInformationMessage(
					`Project overview generated successfully in ${path.basename(savedPath)}`,
					"Open File"
				);

				if (action === "Open File") {
					const document = await vscode.workspace.openTextDocument(savedPath);
					await vscode.window.showTextDocument(document);
				}

				// Also show brief summary in output channel
				outputChannel.clear();
				outputChannel.appendLine("✅ PROJECT OVERVIEW GENERATED");
				outputChannel.appendLine("────────────────────────────────────────");
				outputChannel.appendLine(`📄 File: ${path.basename(savedPath)}`);
				outputChannel.appendLine(`📁 Project: ${overview.projectName ?? "Unknown"}`);
				outputChannel.appendLine(`🏷️  Type: ${overview.projectType ?? "Unknown"}`);
				outputChannel.appendLine(`💻 Language: ${overview.primaryLanguage ?? "Unknown"}`);
				if (overview.frameworks.length > 0) {
					outputChannel.appendLine(`🔧 Frameworks: ${overview.frameworks.join(", ")}`);
				}
				outputChannel.appendLine("");
				outputChannel.appendLine(`Open ${path.basename(savedPath)} to see the full analysis.`);
			}

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
			const root = workspaceFolders[0]?.uri.fsPath;
			if (!root) {
				vscode.window.showErrorMessage("Unable to determine workspace root path.");
				return;
			}
			runAgent(root);
		}
	);

	context.subscriptions.push(disposable1, disposable2, disposable3);
}

export function deactivate(): void { }
