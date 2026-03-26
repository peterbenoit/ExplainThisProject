# Project Overview

## 🤖 AI Summary

**Explain This Project** is a VS Code extension created by Peter Benoit that analyzes a project's structure and automatically generates a comprehensive `PROJECT_OVERVIEW.md` file. The generated overview covers details about the project's languages, frameworks, dependencies, and architecture. It exposes three commands: one to generate the overview, one to force-overwrite an existing overview, and an "Ask Questions" command that likely allows interactive querying about the project. The extension activates on startup (`onStartupFinished`) and is currently at version 0.2.5, targeting VS Code engine `^1.105.0`.

The project is written in TypeScript and uses **ESBuild** as its bundler, which is typical for VS Code extensions that need fast, lightweight builds. Linting is handled by **ESLint** (with `@typescript-eslint` parser and plugin), and testing uses the official `@vscode/test-cli` and `@vscode/test-electron` packages. The only production dependency is the **openai** package, indicating the extension leverages OpenAI's API (likely for LLM-powered analysis and the "Ask Questions" feature). The project is licensed under MIT.

The source code is organized into a clean, layered architecture under `src/`. An `agent/` directory contains `agentLoop.ts` and `llm.ts`, which likely manage the interaction loop and LLM communication with OpenAI. A `runner/` directory handles file system access, project analysis logic, and markdown rendering. The `services/` layer includes an `agentOrchestrator.ts` (coordinating the agent workflow), `configurationService.ts`, `projectOverviewService.ts`, and `userInterfaceService.ts`, suggesting a well-separated concerns pattern where orchestration, configuration, core logic, and UI interactions are decoupled. Shared types and error handling are split across `types/`, `utils/`, and root-level modules. This structure reflects a service-oriented architecture that would be straightforward to extend or test independently.

To get started as a developer, clone the repository from GitHub, run `npm install` to pull dependencies, and then run `npm run watch` to start a development build with live reloading (using `npm-run-all` to watch both esbuild and TypeScript type-checking in parallel). Running `npm run compile` performs a one-shot build, and `npm test` runs the extension test suite. To package and install the extension locally, use `npm run install-extension`, which calls `vsce package` and installs the resulting `.vsix` file into VS Code. Additional documentation is available in `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, and `vsc-extension-quickstart.md`.

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
**Version:** 0.2.5
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
- `vsc-extension-quickstart.md`

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
*Generated by Explain This Project extension on 2026-03-26T18:10:13.207Z*