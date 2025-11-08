# Explain This Project

A powerful VS Code extension that analyzes your project structure and generates a comprehensive `PROJECT_OVERVIEW.md` file with details about languages, frameworks, dependencies, and architecture.

## Features

### **Multi-Language Support**
- **JavaScript/TypeScript** - Analyzes package.json, detects frameworks (React, Vue, Svelte, Next.js, Express, etc.)
- **Python** - Supports requirements.txt and pyproject.toml, detects Django/Flask frameworks
- **Rust** - Parses Cargo.toml, identifies applications vs libraries
- **Go** - Analyzes go.mod files and project structure
- **PHP** - Reads composer.json, detects Laravel, Symfony, CakePHP
- **Java, C#, C++, C** - Basic file extension detection

### **Smart Project Analysis**
- **Project Name & Type** detection from configuration files
- **Framework Detection** from declared dependencies (no guesswork)
- **Entry Points** identification based on language conventions
- **Dependency Analysis** from package managers
- **Directory Structure** overview (ignores noise like node_modules)

### **Clean Output**
- Generates a well-formatted `PROJECT_OVERVIEW.md` file
- Structured sections for easy reading
- Timestamps for tracking when analysis was performed
- No hallucination - only reports what actually exists

## Usage

1. **Open a project folder** in VS Code
2. **Open Command Palette** (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. **Run command**: `Explain This Project`
4. **View results**: The extension creates `PROJECT_OVERVIEW.md` in your project root

### Example Output

```markdown
# Project Overview

## Basic Information

**Name:** my-react-app
**Type:** VS Code Extension
**Primary Language:** TypeScript

## VS Code Extension Details

**Display Name:** My React App
**Version:** 1.0.0
**Publisher:** peterbenoit

## Available Scripts

| Script | Command |
|--------|---------|
| `npm run dev` | vite |
| `npm run build` | vite build |
| `npm run test` | vitest |

## 🛠️ Development Tools

**Build Tools:**
- Vite

**Testing:**
- Vitest

**Code Quality:**
- ESLint
- Prettier
```

## Configuration

Customize the extension through VS Code settings:

```json
{
  "explainThisProject.includeDevDependencies": true,
  "explainThisProject.maxDirectoryDepth": 3,
  "explainThisProject.excludeDirectories": [
    "node_modules", ".git", "dist", "build", "coverage"
  ]
}
```

## Requirements

- VS Code 1.105.0 or higher
- An open workspace/folder
- No network connectivity required

## Troubleshooting

**Extension doesn't appear in Command Palette**
- Ensure you have a workspace/folder open in VS Code
- Restart VS Code after installation

**No PROJECT_OVERVIEW.md generated**
- Check VS Code Output panel for error messages
- Ensure you have read permissions in the project directory

**Incomplete analysis**
- Check if configuration files (package.json, etc.) are valid
- Review excluded directories in settings

## License

MIT License - see the [LICENSE](https://github.com/peterbenoit/explain-this-project/blob/main/LICENSE) file for details.

## Issues & Support

Found a bug or have a feature request? Please [open an issue](https://github.com/peterbenoit/explain-this-project/issues) on GitHub.
