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

## Publishing to the VS Code Marketplace

### Step 1 — Create a Publisher Account

If you haven't already:

1. Sign in to the [VS Code Marketplace publisher portal](https://marketplace.visualstudio.com/manage) with a Microsoft account.
2. Click **Create publisher**, set the ID to `peterbenoit`, and fill in a display name and description.
3. The `"publisher"` field in `package.json` must match this ID exactly.

### Step 2 — Create a Personal Access Token (PAT)

`vsce` authenticates via an Azure DevOps PAT, **not** your Marketplace password.

1. Go to [dev.azure.com](https://dev.azure.com) and sign in with the same Microsoft account.
2. Click your profile icon → **Personal access tokens** → **New Token**.
3. Configure the token:
   - **Name:** anything descriptive (e.g., `vsce-publish`)
   - **Organization:** select **All accessible organizations**
   - **Expiration:** set an appropriate duration (max 1 year)
   - **Scopes:** select **Custom defined**, then under **Marketplace** tick **Manage**
4. Click **Create** and copy the token immediately — it won't be shown again.

### Step 3 — Authenticate vsce

```bash
# Install vsce globally if not already installed
npm install -g @vscode/vsce

# Log in with your publisher ID and paste the PAT when prompted
vsce login peterbenoit
```

Your credentials are stored locally in `~/.vsce`. You only need to do this once per machine (or when the PAT expires).

### Step 4 — Pre-publish Checklist

Before publishing, verify:

- [ ] `version` in `package.json` is bumped appropriately (see semver note below)
- [ ] `CHANGELOG.md` has an entry for the new version
- [ ] `README.md` is up to date (it becomes the Marketplace listing page)
- [ ] `icon.png` exists at the project root (128×128 px recommended)
- [ ] No `.vscodeignore` entries are accidentally excluding required files
- [ ] `npm run compile` passes with no TypeScript errors
- [ ] `npm run lint` passes with no ESLint errors
- [ ] `npm test` passes

```bash
# Confirm the package contents before publishing
vsce ls
```

### Step 5 — Publish

```bash
# Publish with an explicit version bump (recommended)
vsce publish patch   # 0.2.5 → 0.2.6  (bug fixes)
vsce publish minor   # 0.2.5 → 0.3.0  (new features, backwards compatible)
vsce publish major   # 0.2.5 → 1.0.0  (breaking changes)

# Or publish without a version bump (uses the version already in package.json)
vsce publish
```

`vsce publish` automatically:
1. Runs the `vscode:prepublish` script (`npm run package`) to produce a production build
2. Packages the extension into a `.vsix`
3. Uploads it to the Marketplace

### Step 6 — Verify the Release

After publishing, the extension typically appears on the Marketplace within a few minutes.

```bash
# Check the published version
vsce show peterbenoit.explain-this-project
```

You can also verify at:
`https://marketplace.visualstudio.com/items?itemName=peterbenoit.explain-this-project`

---

### Package Only (without publishing)

To create a `.vsix` for manual distribution or local testing without publishing:

```bash
# Create the .vsix file
vsce package

# Install it locally for testing
npm run install-extension
```

The `install-extension` script runs `vsce package` and then installs the latest `.vsix` into the running VS Code instance automatically.

---

### Updating an Existing Release

To push a patch update:

1. Update `CHANGELOG.md` with the changes.
2. Run `vsce publish patch` — this bumps the version in `package.json`, commits nothing (you must commit manually), packages, and uploads.
3. Commit and tag the version:

```bash
git add package.json CHANGELOG.md
git commit -m "chore: release v$(node -p "require('./package.json').version")"
git tag "v$(node -p "require('./package.json').version")"
git push && git push --tags
```

### PAT Expiry

When the PAT expires, `vsce publish` will fail with an authentication error. To refresh:

1. Create a new PAT in Azure DevOps (same scopes as above).
2. Run `vsce login peterbenoit` again and paste the new token.

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
