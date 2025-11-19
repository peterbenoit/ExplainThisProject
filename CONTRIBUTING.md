# Contributing to Explain This Project

Thank you for your interest in contributing! This guide contains all the developer information needed to build, test, and publish the extension.

## Development

### Prerequisites

```bash
# Install VS Code Extension CLI
npm install -g @vscode/vsce
```

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

# Lint code
npm run lint

# Package for distribution
vsce package
```

### Testing the Extension

```bash
# Run unit tests
npm test

# Package and install locally
vsce package
code --install-extension explain-this-project-[VERSION].vsix

# Test in Extension Development Host
# Press F5 in VS Code to launch a new Extension Development Host window
```

## Project Structure

```
src/
  extension.ts          # Main extension entry point
  types.ts             # TypeScript type definitions
  agent/               # AI agent functionality
    agentLoop.ts       # Agent interaction loop
    llm.ts            # LLM provider integrations
  runner/              # Project analysis engine
    fileSystem.ts      # File system utilities
    projectAnalysis.ts # Core analysis logic
    renderMarkdown.ts  # Markdown generation
  test/                # Test files
    extension.test.ts  # Extension tests
```

## Publishing

### To VS Code Marketplace

```bash
# First time setup
vsce login <your-publisher-name>

# Publish
vsce publish

# Or publish with version bump
vsce publish patch  # 0.1.0 -> 0.1.1
vsce publish minor  # 0.1.0 -> 0.2.0
vsce publish major  # 0.1.0 -> 1.0.0
```

### Package for Distribution

```bash
# Create .vsix file
vsce package

# Share the .vsix file for manual installation
# Others can install with: code --install-extension explain-this-project-0.1.0.vsix
```

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Ensure linting passes: `npm run lint`
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Ensure all ESLint rules pass
- Test with multiple project types

## Configuration

The extension can be customized through VS Code settings:

```json
{
  "explainThisProject.includeDevDependencies": true,
  "explainThisProject.maxDirectoryDepth": 3,
  "explainThisProject.excludeDirectories": [
    "node_modules", ".git", "dist", "build", "coverage"
  ]
}
```

### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `includeDevDependencies` | boolean | `true` | Include development dependencies in analysis |
| `maxDirectoryDepth` | number | `3` | Maximum directory depth to analyze |
| `excludeDirectories` | array | `["node_modules", ".git", "dist", "build", "coverage"]` | Directories to exclude from analysis |

## Troubleshooting Development Issues

### Common Issues

**Extension doesn't appear in Command Palette**
- Ensure you have a workspace/folder open in VS Code
- Restart VS Code after installation

**No PROJECT_OVERVIEW.md generated**
- Check VS Code Output panel for error messages
- Ensure you have read permissions in the project directory
- Try running on a simpler project first

**Incomplete analysis**
- Check if configuration files (package.json, etc.) are valid JSON/TOML
- Verify the project structure matches expected patterns
- Review excluded directories in settings

**Performance issues with large projects**
- Reduce `maxDirectoryDepth` in settings
- Add large directories to `excludeDirectories`
- Consider analyzing subdirectories separately

### Getting Help

1. Check the [Issues page](https://github.com/peterbenoit/explain-this-project/issues) for similar problems
2. Enable VS Code Developer Tools (`Help > Toggle Developer Tools`) to see console errors
3. Create a minimal reproduction case
4. Open a new issue with:
   - VS Code version
   - Extension version
   - Project type and structure
   - Error messages or logs

## Roadmap

- **VS Code Sidebar View** - Interactive project overview panel
- **CLI Version** - Standalone command-line tool
- **AI Integration** - Optional natural language summaries
- **Configuration Files Analysis** - Deeper insights into project setup
- **Architecture Visualization** - Dependency graphs and structure diagrams

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
