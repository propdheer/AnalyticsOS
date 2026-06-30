# Changelog

## [0.5.2-alpha] - 2026-06-30

### Fixed
- Repaired invalid `frontend/tsconfig.json` caused by a literal PowerShell newline token.
- Silenced TypeScript 6 `baseUrl` deprecation warning safely using `ignoreDeprecations`.

### Added
- Runtime self-check endpoint: `/api/v1/runtime/status`.
- Second Brain verification script: `scripts/verify-second-brain.ps1`.
- v0.5.2 validation script: `scripts/test-v052.ps1`.
- Updated startup script that prints project root and active virtual environment.
- Documentation for the Second Brain folder structure.

### Changed
- App version bumped to `0.5.2-alpha`.
