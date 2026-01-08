export interface ProjectMetadata {
	name: string;
	type: ProjectType;
	primaryLanguage: ProgrammingLanguage;
	version?: string;
	description?: string;
}

export enum ProjectType {
	APPLICATION = 'Application',
	LIBRARY = 'Library',
	VS_CODE_EXTENSION = 'VS Code Extension',
	CLI_TOOL = 'CLI Tool',
	WEB_APP = 'Web Application',
	UNKNOWN = 'Unknown'
}

export enum ProgrammingLanguage {
	TYPESCRIPT = 'TypeScript',
	JAVASCRIPT = 'JavaScript',
	PYTHON = 'Python',
	RUST = 'Rust',
	GO = 'Go',
	PHP = 'PHP',
	JAVA = 'Java',
	CSHARP = 'C#',
	CPP = 'C++',
	C = 'C',
	UNKNOWN = 'Unknown'
}

export interface DependencyInfo {
	name: string;
	version?: string;
	type: 'production' | 'development' | 'peer' | 'optional';
}

export interface ProjectAnalysisOptions {
	includeDevDependencies: boolean;
	maxDirectoryDepth: number;
	excludeDirectories: string[];
	detectEntryPoints: boolean;
	analyzeDependencies: boolean;
}