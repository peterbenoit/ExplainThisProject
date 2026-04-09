# Change Log

All notable changes to the "explain-this-project" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.3.3] - 2026-04-09

### Fixed
- Added detailed git diagnostics to output channel showing exact reason for git detection failures
- Progress notification now includes 300ms delay before showing success dialog to properly dismiss
- Git analysis now logs detection attempts and errors for better troubleshooting

### Changed
- Git error messages are now more descriptive in the output channel
- Output channel shows specific git command errors instead of generic "not available" message

## [0.3.2] - 2026-04-09

### Fixed
- Git analysis now works correctly with AWS CodeCommit repositories and other git configurations where `.git` directory may not be directly visible
- Progress notification (toast) now properly completes and auto-dismisses in all code paths
- Fixed hanging toast issue by moving success dialogs outside the progress callback
- Changed git detection from checking for `.git` folder to using `git rev-parse --git-dir` command for better compatibility

## [0.3.1] - Previous Release

### Added
- Git history insights and analysis features
- Interactive Q&A command
- AI-powered project summaries
