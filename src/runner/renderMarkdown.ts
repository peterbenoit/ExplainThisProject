import { ProjectOverview } from "../types";

export function renderProjectOverview(overview: ProjectOverview): string {
	const lines: string[] = [];

	lines.push("# Project Overview");
	lines.push("");

	// Project Header
	lines.push("## 📋 Basic Information");
	lines.push("");
	lines.push(`**Name:** ${overview.projectName || "Unknown"}`);
	lines.push(`**Type:** ${overview.projectType || "Unknown"}`);
	lines.push(`**Primary Language:** ${overview.primaryLanguage || "Unknown"}`);
	if (overview.license) {
		lines.push(`**License:** ${overview.license}`);
	}
	if (overview.author) {
		lines.push(`**Author:** ${overview.author}`);
	}
	if (overview.repositoryInfo) {
		lines.push(`**Repository:** [${overview.repositoryInfo.url}](${overview.repositoryInfo.url})`);
	}
	lines.push("");

	// VS Code Extension Details
	if (overview.vsCodeExtension) {
		lines.push("## 🧩 VS Code Extension Details");
		lines.push("");
		lines.push(`**Display Name:** ${overview.vsCodeExtension.displayName}`);
		lines.push(`**Version:** ${overview.vsCodeExtension.version}`);
		lines.push(`**Publisher:** ${overview.vsCodeExtension.publisher}`);
		lines.push(`**VS Code Engine:** ${overview.vsCodeExtension.engines}`);
		lines.push("");
		lines.push(`**Description:** ${overview.vsCodeExtension.description}`);
		lines.push("");

		if (overview.vsCodeExtension.categories.length > 0) {
			lines.push(`**Categories:** ${overview.vsCodeExtension.categories.join(", ")}`);
			lines.push("");
		}

		if (overview.vsCodeExtension.commands.length > 0) {
			lines.push("**Commands:**");
			overview.vsCodeExtension.commands.forEach(cmd => {
				lines.push(`- ${cmd}`);
			});
			lines.push("");
		}

		if (overview.vsCodeExtension.activationEvents.length > 0) {
			lines.push("**Activation Events:**");
			overview.vsCodeExtension.activationEvents.forEach(event => {
				lines.push(`- ${event}`);
			});
			lines.push("");
		}
	}

	// How to Run/Build
	if (Object.keys(overview.scripts).length > 0) {
		lines.push("## 🚀 Available Scripts");
		lines.push("");
		lines.push("| Script | Command |");
		lines.push("|--------|---------|");
		Object.entries(overview.scripts).forEach(([name, command]) => {
			lines.push(`| \`npm run ${name}\` | ${command} |`);
		});
		lines.push("");

		// Add helpful instructions
		lines.push("### Quick Start");
		lines.push("");
		if (overview.scripts.install || overview.dependencies.length > 0) {
			lines.push("```bash");
			lines.push("# Install dependencies");
			lines.push("npm install");
			lines.push("");
		}

		if (overview.scripts.dev || overview.scripts.watch) {
			lines.push("# Start development");
			const devCommand = overview.scripts.dev ? 'dev' : 'watch';
			lines.push(`npm run ${devCommand}`);
			lines.push("");
		}

		if (overview.scripts.build || overview.scripts.compile) {
			lines.push("# Build project");
			const buildCommand = overview.scripts.build ? 'build' : 'compile';
			lines.push(`npm run ${buildCommand}`);
			lines.push("");
		}

		if (overview.scripts.test) {
			lines.push("# Run tests");
			lines.push("npm test");
			lines.push("");
		}

		if (overview.vsCodeExtension) {
			lines.push("# Package VS Code Extension");
			lines.push("vsce package");
			lines.push("");
		}

		if (Object.keys(overview.scripts).length > 0) {
			lines.push("```");
			lines.push("");
		}
	}

	// Development Tools
	const hasDevTools = overview.buildTools.length > 0 || overview.testFrameworks.length > 0 || overview.lintingTools.length > 0;
	if (hasDevTools) {
		lines.push("## 🛠️ Development Tools");
		lines.push("");

		if (overview.buildTools.length > 0) {
			lines.push("**Build Tools:**");
			overview.buildTools.forEach(tool => {
				lines.push(`- ${tool}`);
			});
			lines.push("");
		}

		if (overview.testFrameworks.length > 0) {
			lines.push("**Testing:**");
			overview.testFrameworks.forEach(framework => {
				lines.push(`- ${framework}`);
			});
			lines.push("");
		}

		if (overview.lintingTools.length > 0) {
			lines.push("**Code Quality:**");
			overview.lintingTools.forEach(tool => {
				lines.push(`- ${tool}`);
			});
			lines.push("");
		}
	}

	// Frameworks
	if (overview.frameworks.length > 0) {
		lines.push("## 📚 Frameworks & Libraries");
		lines.push("");
		overview.frameworks.forEach(framework => {
			lines.push(`- ${framework}`);
		});
		lines.push("");
	}

	// Configuration Files
	if (overview.configFiles.length > 0) {
		lines.push("## ⚙️ Configuration Files");
		lines.push("");
		overview.configFiles.forEach(file => {
			lines.push(`- \`${file}\``);
		});
		lines.push("");
	}

	// Documentation
	if (overview.documentation.length > 0) {
		lines.push("## 📖 Documentation");
		lines.push("");
		overview.documentation.forEach(doc => {
			lines.push(`- \`${doc}\``);
		});
		lines.push("");
	}

	// CI/CD
	if (overview.cicd.length > 0) {
		lines.push("## 🔄 CI/CD");
		lines.push("");
		overview.cicd.forEach(cicd => {
			lines.push(`- \`${cicd}\``);
		});
		lines.push("");
	}

	// Entry Points
	if (overview.entryPoints.length > 0) {
		lines.push("## 🎯 Entry Points");
		lines.push("");
		overview.entryPoints.forEach(entry => {
			lines.push(`- \`${entry}\``);
		});
		lines.push("");
	}

	// Project Structure
	lines.push("## 📁 Project Structure");
	lines.push("");
	if (overview.structureSummary.length > 0) {
		overview.structureSummary.forEach(dir => {
			lines.push(`- \`${dir}/\``);
		});
	} else {
		lines.push("No directories detected");
	}
	lines.push("");

	// Dependencies (combined for cleaner view)
	const allDeps = [...overview.dependencies, ...overview.devDependencies];
	if (allDeps.length > 0) {
		lines.push("## 📦 Dependencies");
		lines.push("");

		if (overview.dependencies.length > 0) {
			lines.push("**Production:**");
			overview.dependencies.forEach(dep => {
				lines.push(`- ${dep}`);
			});
			lines.push("");
		}

		if (overview.devDependencies.length > 0) {
			lines.push("**Development:**");
			overview.devDependencies.forEach(dep => {
				lines.push(`- ${dep}`);
			});
			lines.push("");
		}
	}

	// Notes
	if (overview.notes.length > 0) {
		lines.push("## 📝 Notes");
		lines.push("");
		overview.notes.forEach(note => {
			lines.push(`- ${note}`);
		});
		lines.push("");
	}

	lines.push("---");
	lines.push(`*Generated by Explain This Project extension on ${new Date().toISOString()}*`);

	return lines.join("\n");
}
