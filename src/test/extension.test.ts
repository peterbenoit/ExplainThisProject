import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { analyzeProject } from '../runner/projectAnalysis';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('peterbenoit.explain-this-project'));
	});

	test('Should activate successfully', async () => {
		const extension = vscode.extensions.getExtension('peterbenoit.explain-this-project');
		assert.ok(extension);
		await extension?.activate();
		assert.strictEqual(extension?.isActive, true);
	});

	test('Command should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('explain-this-project.explainProject'));
	});

	suite('Project Analysis Tests', () => {
		test('Should detect TypeScript project', () => {
			// This test would need a mock project structure
			// For now, test basic functionality
			const testRoot = path.join(__dirname, '../../');
			const result = analyzeProject(testRoot);

			assert.ok(result);
			assert.strictEqual(result.primaryLanguage, 'TypeScript');
			assert.strictEqual(result.projectName, 'explain-this-project');
		});

		test('Should handle empty project gracefully', () => {
			// Test with a non-existent directory
			const result = analyzeProject('/non/existent/path');

			assert.ok(result);
			assert.strictEqual(result.primaryLanguage, 'Unknown');
			assert.strictEqual(result.projectType, 'Unknown');
		});

		test('Should detect dependencies correctly', () => {
			const testRoot = path.join(__dirname, '../../');
			const result = analyzeProject(testRoot);

			assert.ok(result.devDependencies.length > 0);
			assert.ok(result.devDependencies.includes('typescript'));
			assert.ok(result.devDependencies.includes('eslint'));
		});
	});
});
