export interface ProjectOverview {
	projectName: string | null;
	projectType: string | null;
	primaryLanguage: string | null;
	frameworks: string[];
	entryPoints: string[];
	dependencies: string[];
	devDependencies: string[];
	structureSummary: string[];
	notes: string[];
}
