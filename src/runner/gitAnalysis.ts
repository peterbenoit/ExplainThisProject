import { spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { GitAnalysis } from '../types';

/**
 * Analyzes git history to identify hotspots, contributors, and trends.
 * Returns undefined if the project is not a git repository or git is unavailable.
 */
export function analyzeGitHistory(rootPath: string): GitAnalysis | undefined {
	try {
		// Check if .git directory exists
		const gitDir = path.join(rootPath, '.git');
		if (!fs.existsSync(gitDir)) {
			return undefined;
		}

		// Test git availability
		try {
			runGit(['--version'], rootPath);
		} catch {
			return undefined;
		}

		// 1. Churn hotspots - most changed files in the last year
		const churnOutput = runGit(
			['log', '--format=', '--name-only', '--since=1 year ago'],
			rootPath
		);
		const churnHotspots = countByFile(churnOutput.split('\n'))
			.slice(0, 10)
			.map(item => ({ file: item.file, changes: item.count }));

		// 2. Bug clusters - files most often touched in fix/bug commits
		const bugOutput = runGit(
			[
				'log',
				'--format=',
				'--name-only',
				'--regexp-ignore-case',
				'--grep=fix',
				'--grep=bug',
				'--grep=broken'
			],
			rootPath
		);
		const bugClusters = countByFile(bugOutput.split('\n'))
			.slice(0, 10)
			.map(item => ({ file: item.file, fixes: item.count }));

		// 3. Top contributors (last 12 months)
		const contributorOutput = runGit(
			['shortlog', '-sn', '--no-merges', '--since=12 months ago'],
			rootPath
		);
		const topContributors = contributorOutput
			.split('\n')
			.filter(line => line.trim().length > 0)
			.map(line => {
				// Format: "    42\tJohn Doe"
				const match = line.match(/^\s*(\d+)\t(.+)$/);
				if (match) {
					return { name: match[2], commits: parseInt(match[1], 10) };
				}
				return null;
			})
			.filter((item): item is { name: string; commits: number } => item !== null);

		// 4. Commit velocity - last 12 months with sparkline
		const velocityOutput = runGit(
			['log', '--format=%ad', '--date=format:%Y-%m', '--since=13 months ago'],
			rootPath
		);

		// Count commits per month
		const monthCounts = new Map<string, number>();
		velocityOutput.split('\n').forEach(line => {
			const month = line.trim();
			if (month) {
				monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
			}
		});

		// Generate array for last 12 months (fill zeros for missing months)
		const now = new Date();
		const monthlyCommits: number[] = [];
		for (let i = 11; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
			monthlyCommits.push(monthCounts.get(key) || 0);
		}

		const averagePerMonth = monthlyCommits.reduce((a, b) => a + b, 0) / 12;
		const sparkline = generateSparkline(monthlyCommits);
		const trend = calculateTrend(monthlyCommits);

		// 5. Revert/hotfix count
		const revertOutput = runGit(
			[
				'log',
				'--oneline',
				'--since=1 year ago',
				'--regexp-ignore-case',
				'--grep=revert',
				'--grep=hotfix',
				'--grep=emergency',
				'--grep=rollback'
			],
			rootPath
		);
		const revertCount = revertOutput.split('\n').filter(line => line.trim().length > 0).length;

		return {
			churnHotspots,
			bugClusters,
			topContributors,
			commitVelocity: {
				sparkline,
				averagePerMonth: Math.round(averagePerMonth * 10) / 10,
				trend
			},
			revertCount
		};
	} catch (error) {
		// Silently fail - git analysis is optional
		return undefined;
	}
}

/**
 * Runs a git command and returns stdout as a string.
 * Uses spawnSync to pass args directly to the OS, avoiding shell splitting
 * of arguments that contain spaces (e.g. '--since=1 year ago').
 * Throws on error.
 */
function runGit(args: string[], cwd: string): string {
	const result = spawnSync('git', args, {
		cwd,
		encoding: 'utf8',
		timeout: 10000,
	});
	if (result.error) { throw result.error; }
	if (result.status !== 0) {
		throw new Error(`git exited with code ${result.status}: ${result.stderr}`);
	}
	return result.stdout || '';
}

/**
 * Counts occurrences of each file in an array of lines.
 * Returns sorted array (most frequent first).
 */
function countByFile(lines: string[]): { file: string; count: number }[] {
	const counts = new Map<string, number>();

	lines.forEach(line => {
		const file = line.trim();
		if (file && file.length > 0) {
			counts.set(file, (counts.get(file) || 0) + 1);
		}
	});

	return Array.from(counts.entries())
		.map(([file, count]) => ({ file, count }))
		.sort((a, b) => b.count - a.count);
}

/**
 * Generates an ASCII sparkline from an array of numbers.
 * Maps to ▁▂▃▄▅▆▇█ based on relative values.
 */
function generateSparkline(values: number[]): string {
	if (values.length === 0) {
		return '';
	}

	const chars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
	const max = Math.max(...values);
	const min = Math.min(...values);

	// Handle case where all values are the same
	if (max === min) {
		return chars[min === 0 ? 0 : 4].repeat(values.length);
	}

	return values
		.map(value => {
			const normalized = (value - min) / (max - min);
			const index = Math.min(Math.floor(normalized * chars.length), chars.length - 1);
			return chars[index];
		})
		.join('');
}

/**
 * Calculates trend by comparing average of last 3 months vs prior 3 months.
 * Returns 'increasing', 'decreasing', or 'stable'.
 */
function calculateTrend(monthly: number[]): 'increasing' | 'decreasing' | 'stable' {
	if (monthly.length < 6) {
		return 'stable';
	}

	const recent = monthly.slice(-3);
	const prior = monthly.slice(-6, -3);

	const recentAvg = recent.reduce((a, b) => a + b, 0) / 3;
	const priorAvg = prior.reduce((a, b) => a + b, 0) / 3;

	const percentChange = priorAvg === 0 ? 0 : ((recentAvg - priorAvg) / priorAvg) * 100;

	if (percentChange > 10) {
		return 'increasing';
	} else if (percentChange < -10) {
		return 'decreasing';
	} else {
		return 'stable';
	}
}
