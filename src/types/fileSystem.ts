export interface FileInfo {
	path: string;
	name: string;
	extension: string;
	size: number;
	isDirectory: boolean;
	lastModified: Date;
}

export interface DirectoryScanOptions {
	maxDepth: number;
	excludePatterns: string[];
	includeHidden: boolean;
}

export interface FileSystemOperation {
	type: 'read' | 'write' | 'scan' | 'exists';
	path: string;
	timestamp: Date;
	success: boolean;
	duration?: number;
}