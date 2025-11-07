# TODO

## Immediate
- [ ] Refactor code to isolate the analysis step from output formatting.
- [ ] Move Markdown generation to its own utility module: `src/runner/renderMarkdown.ts`.
- [ ] Ensure the extension handles projects with no `package.json` gracefully (already works, verify on real codebases).

## Near-Term (Mode 6 Enhancements)
- [ ] Add detection for Python (`requirements.txt`, `pyproject.toml`).
- [ ] Add detection for PHP (`composer.json`, `vendor/`).
- [ ] Add detection for Go (`go.mod`).
- [ ] Add detection for Rust (`Cargo.toml`).
- [ ] Add classification for “Library” vs “Application” based on presence/absence of `src/` and runnable scripts.

## AI Integration (Do Not Start Until Analysis Is Solid)
- [ ] Add a summarization command:
      `Explain This Project: Summarize`
  - Input: `PROJECT_OVERVIEW.md`
  - Output: natural language summary in a side panel.
- [ ] Do **not** let AI access the raw project tree directly. Summarization must always be based on the structured overview.

## UI Enhancements
- [ ] Add VS Code sidebar view for:
  - Overview
  - Dependencies
  - Entry points
  - Scripts
- [ ] Add “Open project root” button in sidebar.

## CLI Option (Optional Later)
- [ ] Create a CLI wrapper called `explain-project`.
- [ ] Share logic between CLI and VS Code extension using a common core module.

