export interface ProjectOverview {
	projectName: string | null;
	projectType: string | null;
	primaryLanguage: string | null;
	frameworks: string[];
	entryPoints: string[];
	dependencies: string[];
	devDependencies: string[];
	structureSummary: string[];
	scripts: { [key: string]: string };
	buildTools: string[];
	testFrameworks: string[];
	lintingTools: string[];
	configFiles: string[];
	documentation: string[];
	cicd: string[];
	vsCodeExtension?: {
		displayName: string;
		description: string;
		version: string;
		publisher: string;
		categories: string[];
		commands: string[];
		activationEvents: string[];
		engines: string;
	};
	repositoryInfo?: {
		url: string;
		type: string;
	};
	license: string | null;
	author: string | null;
	notes: string[];
}
