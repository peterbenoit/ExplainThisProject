# Project Overview

## 🤖 AI Summary

**Explain This Project** is a VS Code extension created by Peter Benoit that analyzes a project's structure and automatically generates a comprehensive `PROJECT_OVERVIEW.md` file. The generated overview captures details about the project's languages, frameworks, dependencies, and architecture. It exposes three commands: one to generate the overview, one to force-overwrite an existing overview, and an "Ask Questions" command that leverages an LLM-powered agent to let developers interrogate their project interactively. The extension is currently at version 0.3.0 and is licensed under MIT.

The project is written in TypeScript and targets VS Code engine `^1.105.0`. It uses **esbuild** as its bundler rather than webpack, which is a deliberate choice for faster build times. The only production dependency is the **openai** package, which powers the LLM integration found in `src/agent/llm.ts` and the agent loop in `src/agent/agentLoop.ts`. Development tooling includes ESLint with TypeScript-specific plugins for code quality, the official `@vscode/test-cli` and `@vscode/test-electron` packages for extension testing, and `@vscode/vsce` for packaging the extension into a `.vsix` file.

The source code follows a clean, layered architecture. The `runner/` directory handles low-level concerns like file system traversal, git history analysis, project analysis, and markdown rendering. The `services/` layer sits above it, orchestrating these runners through an `agentOrchestrator`, a `configurationService`, a `projectOverviewService`, and a `userInterfaceService`. The `agent/` directory encapsulates the LLM interaction logic. Shared types and error handling are separated into dedicated `types/` and `utils/` directories. This separation of concerns makes the codebase navigable and testable. Notably, git analysis (`gitAnalysis.ts`) produces churn hotspots, bug clusters, commit velocity, and revert/hotfix metrics — all visible in the generated overview.

To get started as a developer, clone the repository from GitHub, run `npm install` to pull dependencies, then run `npm run watch` to start both esbuild and the TypeScript compiler in watch mode for live development. The extension activates on `onStartupFinished`, so you can press F5 in VS Code to launch an Extension Development Host and test it immediately. Use `npm run compile` for a one-off build, `npm test` to run the test suite, and `npm run install-extension` (or the `-win` variant on Windows) to package and install the extension locally. The project also includes `CONTRIBUTING.md` and `CHANGELOG.md` documentation for onboarding contributors.

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
| `npm run install-extension-win` | vsce package && node -e "const fs=require('fs');const f=fs.readdirSync('.').filter(x=>x.endsWith('.vsix')).sort().pop();require('child_process').execSync('code --install-extension '+f,{stdio:'inherit'})" |
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
| `package.json` | 26 |
| `README.md` | 8 |
| `src/extension.ts` | 7 |
| `src/runner/projectAnalysis.ts` | 6 |
| `PROJECT_OVERVIEW.md` | 5 |
| `.gitignore` | 5 |
| `src/runner/renderMarkdown.ts` | 4 |
| `src/types/config.ts` | 4 |
| `src/agent/llm.ts` | 4 |
| `src/services/configurationService.ts` | 3 |

### 🐛 Bug Clusters

Files most often touched in fix/bug-related commits:

| File | Fix Commits |
|------|-------------|
| `package.json` | 1 |
| `src/extension.ts` | 1 |
| `src/runner/gitAnalysis.ts` | 1 |
| `src/runner/projectAnalysis.ts` | 1 |
| `src/runner/renderMarkdown.ts` | 1 |
| `src/services/configurationService.ts` | 1 |
| `src/types.ts` | 1 |
| `src/types/config.ts` | 1 |

### 📈 Commit Velocity

**Average:** 3 commits/month 📉 decreasing

**Trend (last 12 months):** ▁▁▁▁▁▁█▁▁▁▂▁

### 🚨 Revert/Hotfix Activity

**1** revert/hotfix commit in the last 12 months

---
*Generated by Explain This Project extension on 2026-04-09T14:01:25.951Z*