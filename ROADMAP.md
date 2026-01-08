# Project Roadmap

## Phase 1 — Foundation & Code Health
- [x] Improve TypeScript strictness across `src/agent` and `src/runner`
- [x] Add consistent error-handling patterns for LLM calls and FS operations
- [x] Refactor agent loop and model interface boundaries
- [x] Introduce shared interfaces for agent messages, tasks, and events

## Phase 2 — Tooling & Developer Experience
- [ ] Add npm scripts for `dev`, `lint`, `test`, `build`
- [ ] Enhance ESLint rules and integrate Prettier
- [ ] Improve `esbuild.js` structure (dev vs prod builds)
- [ ] Add AGENTS.md documenting conventions and architecture

## Phase 3 — Testing Expansion
- [ ] Add unit tests for agent loop messaging
- [ ] Add tests for project analysis logic
- [ ] Add fallback behavior tests for LLM failures
- [ ] Add markdown rendering snapshot tests
- [ ] Add extension activation integration test

## Phase 4 — Architecture & Performance
- [ ] Introduce plugin-friendly architecture for LLM providers
- [ ] Add memoization/caching in `projectAnalysis.ts`
- [ ] Lazy-load agent logic to reduce extension activation time

## Phase 5 — User Experience Enhancements
- [ ] Add VS Code settings for model selection, temperature, token limits, logging level
- [ ] Add status bar indicator for agent activity
- [ ] Add output channel for agent logs

## Phase 6 — Documentation & Examples
- [ ] Expand README with architecture diagram, examples, troubleshooting
- [ ] Update CONTRIBUTING.md with workflows and testing guidelines

## Phase 7 — Production Polish
- [ ] Minify production build
- [ ] Validate `.vscodeignore` for minimal package size
- [ ] Add version bump and release notes workflow