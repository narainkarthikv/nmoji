# Changelog

All notable changes to this project will be documented in this file. Contributors and maintainers **must** record every meaningful change here using an industry-standard format.

To keep the history clear:

1. Follow the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.
2. Use [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for releases.
3. Prefer [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) when writing commit messages so that changelog entries can be generated and reviewed easily.
4. Update the **Unreleased** section with each pull request; group changes under `Added`, `Changed`, `Fixed`, etc.
5. When cutting a release, move entries into a versioned heading and tag the GitHub release accordingly.

These practices make it easier for everyone to track what's been done and why, and ensure our changelog remains a reliable source of truth.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No unreleased changes yet.

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

### Refactored

- Internal codebase cleanup and structural updates during UI/system migrations.

[Unreleased]: https://github.com/narainkarthikv/nmoji/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/narainkarthikv/nmoji/releases/tag/v1.0.0
