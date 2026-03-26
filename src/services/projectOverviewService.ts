import * as fs from 'fs';
import * as path from 'path';
import { analyzeProject, AnalysisOptions } from '../runner/projectAnalysis';
import { renderProjectOverview } from '../runner/renderMarkdown';
import { FileSystemError } from '../errors';

export interface IProjectOverviewService {
	ensureOverviewExists(rootPath: string, options?: AnalysisOptions): Promise<string>;
	generateOverview(rootPath: string, options?: AnalysisOptions): Promise<string>;
	getOverviewContent(rootPath: string): Promise<string>;
	overviewExists(rootPath: string): boolean;
}

export class ProjectOverviewService implements IProjectOverviewService {
	constructor() { }

	overviewExists(rootPath: string): boolean {
		const overviewPath = path.join(rootPath, 'PROJECT_OVERVIEW.md');
		return fs.existsSync(overviewPath);
	}

	async getOverviewContent(rootPath: string): Promise<string> {
		const overviewPath = path.join(rootPath, 'PROJECT_OVERVIEW.md');

		try {
			return fs.readFileSync(overviewPath, 'utf8');
		} catch (error) {
			throw new FileSystemError('read project overview', overviewPath, error as Error);
		}
	}

	async generateOverview(rootPath: string, options?: AnalysisOptions): Promise<string> {
		try {
			const overview = analyzeProject(rootPath, options);
			return renderProjectOverview(overview);
		} catch (error) {
			throw new FileSystemError('generate project overview', rootPath, error as Error);
		}
	}

	async ensureOverviewExists(rootPath: string, options?: AnalysisOptions): Promise<string> {
		const overviewPath = path.join(rootPath, 'PROJECT_OVERVIEW.md');

		if (!this.overviewExists(rootPath)) {
			const content = await this.generateOverview(rootPath, options);

			try {
				fs.writeFileSync(overviewPath, content, 'utf8');
			} catch (error) {
				throw new FileSystemError('write project overview', overviewPath, error as Error);
			}
		}

		return this.getOverviewContent(rootPath);
	}
}
