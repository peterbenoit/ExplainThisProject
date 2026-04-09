# Project Overview

## 🤖 AI Summary

**Explain This Project** is a Visual Studio Code extension created by Peter Benoit that analyzes a project's structure and automatically generates a comprehensive `PROJECT_OVERVIEW.md` file. The generated overview includes details about the project's languages, frameworks, dependencies, and architecture. It exposes three commands: one to generate the overview, one to force-overwrite an existing overview, and an "Ask Questions" command that allows interactive querying about the project. The extension activates on startup and is currently at version 0.3.2, targeting VS Code engine ^1.105.0.

The project is written in TypeScript and uses **esbuild** as its bundler, with type-checking handled by the TypeScript compiler separately. Its only production dependency is the **openai** package, which indicates that the extension leverages OpenAI's API (likely for LLM-powered analysis and the "Ask Questions" feature). The development toolchain includes ESLint for code quality, the official `@vscode/test-cli` and `@vscode/test-electron` packages for testing, and `@vscode/vsce` for packaging the extension into a `.vsix` file.

The source code is organized into a clean, layered architecture. The `agent/` directory contains an agent loop and LLM integration (`agentLoop.ts`, `llm.ts`), suggesting an agentic pattern where the LLM is called iteratively. The `runner/` directory handles core analysis tasks—file system traversal, Git history analysis, project analysis, and Markdown rendering. A `services/` layer provides orchestration (`agentOrchestrator.ts`), configuration management, UI interaction, and the main project overview generation logic. Shared types and error handling are separated into their own `types/` and `utils/` directories. Git churn data shows that `package.json`, `src/extension.ts`, and `src/runner/projectAnalysis.ts` are the most frequently modified files, and `src/runner/gitAnalysis.ts` has been a notable bug cluster, having been touched in two fix-related commits.

To get started as a developer, clone the repository from GitHub, run `npm install` to pull dependencies, and then use `npm run watch` to start a development build with live recompilation via esbuild and TypeScript type-checking in watch mode. You can run the full test suite with `npm test` (which first compiles, runs compile-tests, and lints). To package and install the extension locally, run `npm run install-extension` (or `install-extension-win` on Windows), which invokes `vsce package` and installs the resulting `.vsix` into VS Code. Documentation is available in `README.md`, `CHANGELOG.md`, and `CONTRIBUTING.md`. The project is MIT-licensed.

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
**Version:** 0.3.2
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
| `npm run compile-tests` | tsc -p ./ |
| `npm run check-types` | tsc --noEmit |
| `npm run watch` | npm-run-all -p watch:* |
| `npm run watch:esbuild` | node esbuild.js --watch |
| `npm run watch:tsc` | tsc --noEmit --watch --project tsconfig.json |
| `npm run package` | npm run check-types && node esbuild.js --production |
| `npm run install-extension` | vsce package && code --install-extension $(ls explain-this-project-*.vsix | sort -V | tail -1) |
| `npm run install-extension-win` | vsce package && node -e "const fs=require('fs');const f=fs.readdirSync('.').filter(x=>x.endsWith('.vsix')).sort().pop();require('child_process').execSync('code --install-extension '+f,{stdio:'inherit'})" |
| `npm run pretest` | npm run compile && npm run compile-tests && npm run lint |
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
│   ├── gitAnalysis.ts
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
- @vscode/vsce
- esbuild
- eslint
- npm-run-all
- typescript

## 🔀 Git Insights

*Analyzing the last 12 months of commit history*

### 🔥 Churn Hotspots

Files changed most frequently:

| File | Changes |
|------|---------|
| `package.json` | 29 |
| `README.md` | 11 |
| `src/extension.ts` | 9 |
| `.gitignore` | 6 |
| `PROJECT_OVERVIEW.md` | 6 |
| `src/runner/projectAnalysis.ts` | 6 |
| `src/runner/gitAnalysis.ts` | 4 |
| `src/runner/renderMarkdown.ts` | 4 |
| `src/types/config.ts` | 4 |
| `src/agent/llm.ts` | 4 |

### 🐛 Bug Clusters

Files most often touched in fix/bug-related commits:

| File | Fix Commits |
|------|-------------|
| `CHANGELOG.md` | 2 |
| `package.json` | 2 |
| `src/runner/gitAnalysis.ts` | 2 |
| `README.md` | 1 |
| `src/extension.ts` | 1 |
| `src/runner/projectAnalysis.ts` | 1 |
| `src/runner/renderMarkdown.ts` | 1 |
| `src/services/configurationService.ts` | 1 |
| `src/types.ts` | 1 |
| `src/types/config.ts` | 1 |

### 📈 Commit Velocity

**Average:** 3.7 commits/month 📉 decreasing

**Trend (last 12 months):** ▁▁▁▁▁▁█▁▁▁▂▃

### 🚨 Revert/Hotfix Activity

**1** revert/hotfix commit in the last 12 months

---
*Generated by Explain This Project extension on 2026-04-09T19:51:27.103Z*