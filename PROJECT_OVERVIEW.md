# Project Overview

## 🤖 AI Summary

**Explain This Project** is a VS Code extension (v0.3.0) created by Peter Benoit that analyzes a project's structure and automatically generates a comprehensive `PROJECT_OVERVIEW.md` file. The generated overview covers details about the project's languages, frameworks, dependencies, and architecture. It exposes three commands: one to generate the overview, one to force-overwrite an existing overview, and an "Ask Questions" command that allows interactive querying about the project. The extension activates on startup (`onStartupFinished`) and is published under the MIT license.

The project is written in TypeScript, targets VS Code engine `^1.105.0`, and uses **esbuild** as its bundler rather than webpack—a choice that favors faster build times. Type checking is handled separately via `tsc --noEmit`, and the development workflow supports parallel watching of both esbuild and TypeScript type checks through `npm-run-all`. Linting is provided by ESLint with the `@typescript-eslint` parser and plugin, and testing leverages the official `@vscode/test-cli` and `@vscode/test-electron` packages for running extension integration tests.

The sole production dependency is the **openai** npm package, which indicates the extension uses OpenAI's API (likely via an LLM) to power its project analysis and question-answering capabilities. The source structure reflects this clearly: the `agent/` directory contains `agentLoop.ts` and `llm.ts` for managing LLM interactions, while the `runner/` directory handles file system access, project analysis logic, and Markdown rendering. A `services/` layer orchestrates these concerns through dedicated modules—`agentOrchestrator.ts` coordinates the agent, `configurationService.ts` manages settings, `projectOverviewService.ts` drives the overview generation, and `userInterfaceService.ts` handles VS Code UI interactions. Error handling and type definitions are organized into their own `types/` and `utils/` directories, showing a clean separation of concerns.

To get started as a developer, clone the repository from GitHub, run `npm install` to pull in dependencies, and then use `npm run watch` to start a parallel development build with live esbuild bundling and TypeScript type checking. From there, you can press F5 in VS Code to launch an Extension Development Host for testing. To produce a distributable `.vsix` package, run `vsce package`, or use the convenience script `npm run install-extension` which packages and installs the extension locally in one step. The project includes `README.md`, `CHANGELOG.md`, and `CONTRIBUTING.md` for further guidance.

---


## 📋 Basic Information

**Name:** explain-this-project
**Type:** VS Code Extension
**Primary Language:** TypeScript
**License:** MIT
**Author:** Peter Benoit
**Repository:** [https://github.com/peterbenoit/explain-this-project.git](https://github.com/peterbenoit/explain-this-project.git)

## 🧩 VS Code Extension Details

**Display Name:** Explain This Project
**Version:** 0.3.0
**Publisher:** peterbenoit
**VS Code Engine:** ^1.105.0

**Description:** Analyzes your project structure and generates a comprehensive PROJECT_OVERVIEW.md file with details about languages, frameworks, dependencies, and architecture.

**Categories:** Other, Programming Languages

**Commands:**
- explain-this-project.explainProject: Explain This Project
- explain-this-project.explainProjectForceOverwrite: Explain This Project (Force Overwrite)
- explain-this-project.askQuestions: Explain This Project: Ask Questions

**Activation Events:**
- onStartupFinished

## 🚀 Available Scripts

| Script | Command |
|--------|---------|
| `npm run vscode:prepublish` | npm run package |
| `npm run compile` | npm run check-types && node esbuild.js |
| `npm run check-types` | tsc --noEmit |
| `npm run watch` | npm-run-all -p watch:* |
| `npm run watch:esbuild` | node esbuild.js --watch |
| `npm run watch:tsc` | tsc --noEmit --watch --project tsconfig.json |
| `npm run package` | npm run check-types && node esbuild.js --production |
| `npm run install-extension` | vsce package && code --install-extension $(ls explain-this-project-*.vsix | sort -V | tail -1) |
| `npm run pretest` | npm run compile && npm run lint |
| `npm run lint` | eslint src |
| `npm run test` | vscode-test |

### Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run watch

# Build project
npm run compile

# Run tests
npm test

# Package VS Code Extension
vsce package

```

## 🛠️ Development Tools

**Build Tools:**
- ESBuild

**Testing:**
- VS Code Extension Test

**Code Quality:**
- ESLint

## ⚙️ Configuration Files

- `tsconfig.json`
- `eslint.config.mjs`
- `.gitignore`
- `LICENSE`

## 📖 Documentation

- `README.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`

## 📁 Source Structure

```
src/
├── agent/
│   ├── agentLoop.ts
│   └── llm.ts
├── runner/
│   ├── fileSystem.ts
│   ├── projectAnalysis.ts
│   └── renderMarkdown.ts
├── services/
│   ├── agentOrchestrator.ts
│   ├── configurationService.ts
│   ├── projectOverviewService.ts
│   └── userInterfaceService.ts
├── test/
│   └── extension.test.ts
├── types/
│   ├── config.ts
│   └── errors.ts
├── utils/
│   └── errorHandler.ts
├── errors.ts
├── extension.ts
└── types.ts
```

## 📦 Dependencies

**Production:**
- openai

**Development:**
- @types/mocha
- @types/node
- @types/vscode
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- @vscode/test-cli
- @vscode/test-electron
- esbuild
- eslint
- npm-run-all
- typescript

---
*Generated by Explain This Project extension on 2026-04-09T13:43:42.530Z*