# Explain This Project

A powerful VS Code extension that analyzes your project structure and generates a comprehensive `PROJECT_OVERVIEW.md` file with details about languages, frameworks, dependencies, and architecture.

This is **not** a coding agent. It does not modify source code, scaffold new projects, or assume intent. It reads what exists and reports it accurately.

## ✨ Features

### **Multi-Language Support**
- **JavaScript/TypeScript** - Analyzes package.json, detects frameworks (React, Vue, Svelte, Next.js, Express, etc.)
- **Python** - Supports requirements.txt and pyproject.toml, detects Django/Flask frameworks
- **Rust** - Parses Cargo.toml, identifies applications vs libraries
- **Go** - Analyzes go.mod files and project structure
- **PHP** - Reads composer.json, detects Laravel, Symfony, CakePHP
- **Java, C#, C++, C** - Basic file extension detection
- And more...

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

## 🚀 Usage

1. **Open a project folder** in VS Code
2. **Open Command Palette** (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. **Run command**: `Explain This Project`
4. **View results**: The extension creates `PROJECT_OVERVIEW.md` in your project root

## 📋 Requirements

- VS Code 1.105.0 or higher
- An open workspace/folder (the extension analyzes the current workspace)
- No network connectivity required
- No external dependencies needed

## 🛠️ Development

### Building the Extension

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes during development
npm run watch

# Run tests
npm test

# Package for distribution
vsce package
```

### Project Structure

```
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── types.ts             # TypeScript interfaces
│   └── runner/
│       ├── projectAnalysis.ts    # Core analysis logic
│       ├── renderMarkdown.ts     # Markdown generation
│       └── fileSystem.ts         # File utilities
├── package.json             # Extension metadata
└── tsconfig.json           # TypeScript configuration
```

## 🗺️ Roadmap

- **VS Code Sidebar View** - Interactive project overview panel
- **CLI Version** - Standalone command-line tool
- **AI Integration** - Optional natural language summaries
- **Configuration Files Analysis** - Deeper insights into project setup
- **Architecture Visualization** - Dependency graphs and structure diagrams

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

Found a bug or have a feature request? Please [open an issue](https://github.com/yourusername/explain-this-project/issues) on GitHub.
