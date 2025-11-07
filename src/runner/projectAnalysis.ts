import * as fs from "fs";
import * as path from "path";
import { ProjectOverview } from "../types";

export function analyzeProject(root: string): ProjectOverview {
	const overview: ProjectOverview = {
		projectName: null,
		projectType: "Unknown",
		primaryLanguage: "Unknown",
		frameworks: [],
		entryPoints: [],
		dependencies: [],
		devDependencies: [],
		structureSummary: [],
		scripts: {},
		buildTools: [],
		testFrameworks: [],
		lintingTools: [],
		configFiles: [],
		documentation: [],
		cicd: [],
		license: null,
		author: null,
		notes: []
	};

	// --- Check for various project configuration files ---
	const pkgPath = path.join(root, "package.json");
	const cargoPath = path.join(root, "Cargo.toml");
	const goModPath = path.join(root, "go.mod");
	const composerPath = path.join(root, "composer.json");
	const requirementsPath = path.join(root, "requirements.txt");
	const pyprojectPath = path.join(root, "pyproject.toml");

	// --- Node.js/JavaScript/TypeScript projects ---
	let pkg: any = null;
	if (fs.existsSync(pkgPath)) {
		try {
			pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
			overview.projectName = pkg.name || null;
			overview.license = pkg.license || null;
			overview.author = pkg.author ? (typeof pkg.author === 'string' ? pkg.author : pkg.author.name) : null;

			// Repository information
			if (pkg.repository) {
				overview.repositoryInfo = {
					url: typeof pkg.repository === 'string' ? pkg.repository : pkg.repository.url,
					type: typeof pkg.repository === 'string' ? 'git' : pkg.repository.type || 'git'
				};
			}

			if (pkg.dependencies) {
				overview.dependencies = Object.keys(pkg.dependencies);
			}
			if (pkg.devDependencies) {
				overview.devDependencies = Object.keys(pkg.devDependencies);
			}

			// Capture scripts
			if (pkg.scripts) {
				overview.scripts = pkg.scripts;
			}

			const has = (name: string) =>
				(pkg.dependencies && pkg.dependencies[name]) ||
				(pkg.devDependencies && pkg.devDependencies[name]);

			// VS Code Extension Detection
			if (pkg.engines && pkg.engines.vscode) {
				overview.projectType = "VS Code Extension";
				overview.vsCodeExtension = {
					displayName: pkg.displayName || pkg.name || 'Unknown',
					description: pkg.description || 'No description',
					version: pkg.version || '0.0.0',
					publisher: pkg.publisher || 'Unknown',
					categories: pkg.categories || [],
					commands: [],
					activationEvents: pkg.activationEvents || [],
					engines: pkg.engines.vscode
				};

				// Extract commands from contributes
				if (pkg.contributes && pkg.contributes.commands) {
					overview.vsCodeExtension.commands = pkg.contributes.commands.map((cmd: any) =>
						`${cmd.command}: ${cmd.title}`
					);
				}
			} else {
				// Determine project type from scripts
				if (pkg.scripts) {
					if (pkg.scripts.start || pkg.scripts.dev) { overview.projectType = "Application"; }
					if (pkg.scripts.build) { overview.projectType += " (Build-enabled)"; }
					if (pkg.scripts.test) { overview.projectType += " (Tested)"; }
				}
			}

			// Build tools detection
			if (has("webpack")) { overview.buildTools.push("Webpack"); }
			if (has("vite")) { overview.buildTools.push("Vite"); }
			if (has("rollup")) { overview.buildTools.push("Rollup"); }
			if (has("parcel")) { overview.buildTools.push("Parcel"); }
			if (has("esbuild")) { overview.buildTools.push("ESBuild"); }
			if (has("babel")) { overview.buildTools.push("Babel"); }

			// Test frameworks detection
			if (has("jest")) { overview.testFrameworks.push("Jest"); }
			if (has("mocha")) { overview.testFrameworks.push("Mocha"); }
			if (has("vitest")) { overview.testFrameworks.push("Vitest"); }
			if (has("cypress")) { overview.testFrameworks.push("Cypress"); }
			if (has("playwright")) { overview.testFrameworks.push("Playwright"); }
			if (has("@vscode/test-electron")) { overview.testFrameworks.push("VS Code Extension Test"); }

			// Linting tools detection
			if (has("eslint")) { overview.lintingTools.push("ESLint"); }
			if (has("prettier")) { overview.lintingTools.push("Prettier"); }
			if (has("tslint")) { overview.lintingTools.push("TSLint"); }
			if (has("stylelint")) { overview.lintingTools.push("Stylelint"); }

			// Framework detection from dependencies (authoritative)
			if (has("react") || has("react-dom")) { overview.frameworks.push("React"); }
			if (has("vue")) { overview.frameworks.push("Vue"); }
			if (has("svelte")) { overview.frameworks.push("Svelte"); }
			if (has("next")) { overview.frameworks.push("Next.js"); }
			if (has("nuxt")) { overview.frameworks.push("Nuxt.js"); }
			if (has("express")) { overview.frameworks.push("Express"); }
			if (has("fastify")) { overview.frameworks.push("Fastify"); }
			if (has("nestjs")) { overview.frameworks.push("NestJS"); }
			if (has("angular")) { overview.frameworks.push("Angular"); }

			// Language detection from deps
			if (has("typescript")) { overview.primaryLanguage = "TypeScript"; }
			else { overview.primaryLanguage = "JavaScript"; }
		} catch {
			// If package.json exists but isn't readable, we move on.
		}
	}

	// --- Rust projects ---
	if (fs.existsSync(cargoPath)) {
		try {
			const cargoContent = fs.readFileSync(cargoPath, "utf8");
			const nameMatch = cargoContent.match(/name\s*=\s*"([^"]+)"/);
			if (nameMatch) {
				overview.projectName = nameMatch[1];
			}
			overview.primaryLanguage = "Rust";
			overview.projectType = cargoContent.includes('[[bin]]') ? "Application" : "Library";

			// Extract dependencies from Cargo.toml
			const depsSection = cargoContent.match(/\[dependencies\]([\s\S]*?)(?=\[|\Z)/);
			if (depsSection) {
				const deps = depsSection[1].match(/^(\w+)\s*=/gm);
				if (deps) {
					overview.dependencies = deps.map(dep => dep.replace(/\s*=.*/, ''));
				}
			}
		} catch {
			overview.notes.push("Found Cargo.toml but couldn't parse it");
		}
	}

	// --- Go projects ---
	if (fs.existsSync(goModPath)) {
		try {
			const goModContent = fs.readFileSync(goModPath, "utf8");
			const moduleMatch = goModContent.match(/module\s+(.+)/);
			if (moduleMatch) {
				const modulePath = moduleMatch[1].trim();
				overview.projectName = path.basename(modulePath);
			}
			overview.primaryLanguage = "Go";
			overview.projectType = "Application"; // Go projects are typically applications
		} catch {
			overview.notes.push("Found go.mod but couldn't parse it");
		}
	}

	// --- PHP projects ---
	if (fs.existsSync(composerPath)) {
		try {
			const composer = JSON.parse(fs.readFileSync(composerPath, "utf8"));
			overview.projectName = composer.name || null;
			overview.primaryLanguage = "PHP";

			if (composer.require) {
				overview.dependencies = Object.keys(composer.require);
			}
			if (composer["require-dev"]) {
				overview.devDependencies = Object.keys(composer["require-dev"]);
			}

			// Framework detection for PHP
			const hasPhp = (name: string) =>
				(composer.require && composer.require[name]) ||
				(composer["require-dev"] && composer["require-dev"][name]);

			if (hasPhp("laravel/framework")) { overview.frameworks.push("Laravel"); }
			if (hasPhp("symfony/symfony")) { overview.frameworks.push("Symfony"); }
			if (hasPhp("cakephp/cakephp")) { overview.frameworks.push("CakePHP"); }
		} catch {
			overview.notes.push("Found composer.json but couldn't parse it");
		}
	}

	// --- Python projects ---
	let pythonDeps: string[] = [];
	if (fs.existsSync(requirementsPath)) {
		try {
			const requirements = fs.readFileSync(requirementsPath, "utf8");
			pythonDeps = requirements.split('\n')
				.filter(line => line.trim() && !line.trim().startsWith('#'))
				.map(line => line.split(/[>=<]/)[0].trim())
				.filter(dep => dep);
			overview.dependencies = pythonDeps;
		} catch {
			overview.notes.push("Found requirements.txt but couldn't parse it");
		}
	}

	if (fs.existsSync(pyprojectPath)) {
		try {
			const pyprojectContent = fs.readFileSync(pyprojectPath, "utf8");
			const nameMatch = pyprojectContent.match(/name\s*=\s*"([^"]+)"/);
			if (nameMatch) {
				overview.projectName = nameMatch[1];
			}
			overview.primaryLanguage = "Python";
		} catch {
			overview.notes.push("Found pyproject.toml but couldn't parse it");
		}
	}

	// --- Detect configuration files ---
	const commonConfigFiles = [
		'tsconfig.json', 'jsconfig.json',
		'eslint.config.js', 'eslint.config.mjs', '.eslintrc.js', '.eslintrc.json',
		'prettier.config.js', '.prettierrc',
		'webpack.config.js', 'vite.config.js', 'rollup.config.js',
		'.gitignore', '.gitattributes',
		'Dockerfile', 'docker-compose.yml',
		'.env', '.env.example',
		'LICENSE', 'LICENSE.md', 'LICENSE.txt',
		'.nvmrc', '.node-version'
	];

	for (const configFile of commonConfigFiles) {
		if (fs.existsSync(path.join(root, configFile))) {
			overview.configFiles.push(configFile);
		}
	}

	// --- Detect documentation files ---
	const commonDocFiles = [
		'README.md', 'README.txt',
		'CHANGELOG.md', 'CHANGELOG.txt',
		'CONTRIBUTING.md',
		'TODO.md', 'TODO.txt',
		'API.md', 'USAGE.md',
		'vsc-extension-quickstart.md'
	];

	for (const docFile of commonDocFiles) {
		if (fs.existsSync(path.join(root, docFile))) {
			overview.documentation.push(docFile);
		}
	}

	// --- Detect CI/CD files ---
	const cicdPaths = [
		'.github/workflows',
		'.gitlab-ci.yml',
		'azure-pipelines.yml',
		'Jenkinsfile',
		'.travis.yml',
		'.circleci/config.yml'
	];

	for (const cicdPath of cicdPaths) {
		if (fs.existsSync(path.join(root, cicdPath))) {
			overview.cicd.push(cicdPath);
		}
	}

	// --- Walk all files for fallback detection ---
	const files = walk(root);

	// If no language determined by config files, fall back to extensions
	if (overview.primaryLanguage === "Unknown") {
		if (files.some(f => f.endsWith(".rs"))) { overview.primaryLanguage = "Rust"; }
		else if (files.some(f => f.endsWith(".go"))) { overview.primaryLanguage = "Go"; }
		else if (files.some(f => f.endsWith(".ts"))) { overview.primaryLanguage = "TypeScript"; }
		else if (files.some(f => f.endsWith(".js"))) { overview.primaryLanguage = "JavaScript"; }
		else if (files.some(f => f.endsWith(".py"))) { overview.primaryLanguage = "Python"; }
		else if (files.some(f => f.endsWith(".php"))) { overview.primaryLanguage = "PHP"; }
		else if (files.some(f => f.endsWith(".java"))) { overview.primaryLanguage = "Java"; }
		else if (files.some(f => f.endsWith(".cs"))) { overview.primaryLanguage = "C#"; }
		else if (files.some(f => f.endsWith(".cpp") || f.endsWith(".cc") || f.endsWith(".cxx"))) { overview.primaryLanguage = "C++"; }
		else if (files.some(f => f.endsWith(".c"))) { overview.primaryLanguage = "C"; }
	}

	// Only if no framework determined yet, fallback to file patterns
	if (overview.frameworks.length === 0) {
		if (files.some(f => f.endsWith(".vue"))) { overview.frameworks.push("Vue"); }
		if (files.some(f => f.endsWith(".jsx") || f.endsWith(".tsx"))) { overview.frameworks.push("React"); }
		if (files.some(f => f.includes("svelte"))) { overview.frameworks.push("Svelte"); }
	}

	// Entry point detection based on language and project type
	let candidates: string[] = [];

	if (overview.primaryLanguage === "JavaScript" || overview.primaryLanguage === "TypeScript") {
		candidates = [
			"src/main.ts", "src/main.js",
			"src/index.ts", "src/index.js",
			"index.js", "index.ts",
			"app.js", "app.ts",
			"server.js", "server.ts"
		];
	} else if (overview.primaryLanguage === "Python") {
		candidates = [
			"main.py", "app.py", "__main__.py",
			"src/main.py", "src/app.py",
			"manage.py", "run.py"
		];
	} else if (overview.primaryLanguage === "Go") {
		candidates = ["main.go", "cmd/main.go"];
	} else if (overview.primaryLanguage === "Rust") {
		candidates = ["src/main.rs", "src/lib.rs"];
	} else if (overview.primaryLanguage === "PHP") {
		candidates = ["index.php", "public/index.php", "app.php"];
	} else if (overview.primaryLanguage === "Java") {
		candidates = ["src/main/java/Main.java", "Main.java"];
	}

	overview.entryPoints = candidates
		.map(rel => path.join(root, rel))
		.filter(fs.existsSync)
		.map(fullPath => path.relative(root, fullPath));

	// Directory summary (top-level only)
	try {
		overview.structureSummary = fs.readdirSync(root, { withFileTypes: true })
			.filter(d => d.isDirectory() && !["node_modules", ".git"].includes(d.name))
			.map(d => d.name);
	} catch (error) {
		overview.structureSummary = [];
		overview.notes.push("Could not access project directory");
	}

	return overview;
}

function walk(dir: string, fileList: string[] = []): string[] {
	try {
		for (const entry of fs.readdirSync(dir)) {
			const full = path.join(dir, entry);
			if (fs.statSync(full).isDirectory()) {
				if (["node_modules", ".git"].includes(entry)) {
					continue;
				}
				walk(full, fileList);
			} else {
				fileList.push(full);
			}
		}
	} catch (error) {
		// Directory doesn't exist or is not accessible
		return fileList;
	}
	return fileList;
}
