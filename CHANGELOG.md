# Changelog

## [0.5.0-alpha] - 2026-06-30

### Added
- Runtime path choice script: `scripts/configure-runtime-paths.ps1`.
- Optional path-parameterized migration script: `scripts/migrate-runtime-data.ps1`.
- Settings API and Settings screen.
- Integration test buttons for Ollama, AnythingLLM, and Obsidian.
- Integration health widget on Home.
- Quick Capture API and UI.
- Action preview endpoint.
- Live preview in Action Builder.
- Command Palette with Ctrl+K.
- One-command startup script.
- Snapshot sync scripts.
- GitHub Actions CI for backend tests and frontend typecheck.

### Changed
- AnalyticsOS no longer forces LocalAppData as the runtime default.
- Runtime paths are now an explicit per-machine choice.
- Defaults remain repo-relative `../data` and `../knowledge` for continuity.
- `migrate-runtime-to-localappdata.ps1` is now only a helper for personal local-only setups.

## [0.4.1-alpha] - 2026-06-30

### Added
- Home command center.
- Guided navigation.
- Final UX polish.
