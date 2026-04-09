# Change Log

All notable changes to the "explain-this-project" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.3.2] - 2026-04-09

### Fixed
- Git analysis now works correctly with AWS CodeCommit repositories and other git configurations where `.git` directory may not be directly visible
- Progress notification (toast) now properly completes in all code paths, including "Save as New File" and "Cancel" actions
- Changed git detection from checking for `.git` folder to using `git rev-parse --git-dir` command for better compatibility

## [0.3.1] - Previous Release

### Added
- Git history insights and analysis features
- Interactive Q&A command
- AI-powered project summaries
