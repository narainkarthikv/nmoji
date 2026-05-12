# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-05-12

### Added

- Added Docker containerization support for deployment workflows.
- Added `.dockerignore` to keep container builds smaller and focused on runtime files.
- Added GitHub Sponsors and funding metadata for community support.
- Added a dedicated CI workflow for install and production build verification.

### Changed

- Updated production and development demo URLs in project documentation.
- Improved first-time contributor greeting workflow copy and trigger behavior.
- Broadened the release workflow tag pattern to support standard SemVer releases.

### Fixed

- Corrected greeting workflow issues that affected contributor onboarding automation.

## [1.0.0] - 2026-02-25

### Added

- Initial Nmoji release with a browser-based emoji picker experience.
- Core emoji search, category filtering, and selection/copy workflow.
- Browser extension files for quick-access emoji usage.
- Community and governance documentation including contributing guidance, code of conduct, and license.
- GitHub issue and pull request templates for project collaboration.

### Changed

- UI/UX refreshed through multiple iterations for clarity and usability.
- Project migrated from earlier static/JS setup to Astro-based structure.
- Styling system moved to Tailwind CSS with subsequent consistency improvements.
- Default development branch and workflow setup updated for deployment and contribution flow.
- Codebase UI components and pages aligned with Wisdom Fox design-system practices.

### Fixed

- Dark mode behavior and persistence across sessions.
- Merge conflicts and branch sync issues during active development.
- Build errors, runner/workflow issues, and post-migration stability regressions.
- Emoji lazy-loading and performance bottlenecks in browsing flow.
- Layout, filter bar, and emoji grid rendering inconsistencies.

### Documentation

- README updated repeatedly to reflect current setup and features.
- Contributors and repository metadata documentation added and maintained.
- Community process docs and templates expanded over time.
- Design-system guidance references and documentation alignment updated for contributor workflows.

### Refactored

- Internal codebase cleanup and structural updates during UI/system migrations.

[Unreleased]: https://github.com/narainkarthikv/nmoji/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/narainkarthikv/nmoji/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/narainkarthikv/nmoji/releases/tag/v1.0.0
