# Changelog

All notable changes to AnalyticsOS will be documented in this file.

This project follows semantic versioning.

## [0.1.1-alpha] - 2026-06-30

### Added
- Dashboard MVP built with Next.js.
- Frontend API client.
- Dashboard summary cards.
- Object lists for Projects, Datasets, Business Rules, and Memories.
- Frontend install and run scripts.
- Dashboard MVP documentation.
- CORS support for local frontend development.
- CORS test coverage.

### Changed
- Updated API version to `0.1.1-alpha`.
- Updated roadmap with Dashboard CRUD as next release.

## [0.1.0-alpha] - 2026-06-30

### Added
- Local JSON persistence layer.
- Project CRUD API.
- Dataset CRUD API.
- Business Rule CRUD API.
- Prompt Template CRUD API.
- Memory CRUD API.
- Reset local data script.
- MVP API smoke tests.
- MVP test plan.

### Changed
- Updated API version to `0.1.0-alpha`.
- Expanded roadmap toward dashboard, PostgreSQL, and knowledge indexing.

## [0.0.7-alpha] - 2026-06-30

### Added
- Project and Dataset domain models.
- `/api/v1/projects` endpoint.
- `/api/v1/datasets` endpoint.
- API tests for Projects and Datasets.
- `run-quality.ps1` developer workflow script.
- API smoke test documentation.

## [0.0.6-alpha] - 2026-06-30

### Added
- Initial backend domain layer.
- Initial service layer pattern.
- API v1 router structure.

## [0.0.5-alpha] - 2026-06-30

### Added
- Architecture overview.
- System context documentation.
- Domain model documentation.
- API principles documentation.
- ADR-004 API-first backend.
- ADR-005 Canonical domain objects.

## [0.0.4-alpha] - 2026-06-30

### Added
- Founding document.
- Product specification.
- Guiding principles.
- Personas.
- Use cases.
- Product glossary.
- `.gitattributes` for consistent line endings.

### Changed
- Updated MkDocs navigation for Product Handbook volume.

## [0.0.3-alpha] - 2026-06-30

### Added
- `/version` API endpoint.
- PowerShell scripts for installing dependencies, running backend, and running tests.
- Windows development setup documentation.

### Changed
- Updated backend settings to use Pydantic v2 `SettingsConfigDict`.
- Updated API version to `0.0.3-alpha`.

### Fixed
- Removed Pydantic class-based config deprecation warning.

## [0.0.2-alpha] - 2026-06-30

### Added
- Initial repository foundation.
- FastAPI backend scaffold.
- Next.js frontend scaffold.
- MkDocs documentation scaffold.
- Engineering handbook folder structure.
- ADR and RFC templates.
- GitHub Actions CI scaffold.
- Docker Compose foundation.
- Development requirements files.
