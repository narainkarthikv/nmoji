# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-08-17

### Added

- Added a dedicated Combos tab for browsing and copying ZWJ emoji sequences.
- Added an informative ZWJ guide explaining composition, copying, examples, and platform compatibility.
- Added a floating keyboard-shortcuts action button.

### Changed

- Moved the Emojis and Combos navigation tabs into the application header beside the theme switcher.
- Restored the Emojis tab's selected-emoji details and related/popular emoji sidebar.
- Made the ZWJ sequence list independently scrollable on the Combos tab.

### Fixed

- Prevented combo selections from being treated as regular emoji records, eliminating the `undefined` display error.

## [1.2.0] - 2026-06-20

### Added

- Added comprehensive ESLint configuration with TypeScript support (`eslint.config.js`)
  - Configured ESLint v9 flat config format
  - TypeScript linting with `@typescript-eslint` plugin
  - Custom rules for code quality and consistency
  - Browser global support for client-side code
- Added linting and formatting scripts to `package.json`:
  - `npm run lint` - Check for linting issues across `.js,.jsx,.ts,.tsx,.astro` files
  - `npm run lint:fix` - Auto-fix fixable linting issues
  - `npm run format` - Format code with Prettier
  - `npm run format:check` - Check code formatting without changes
- Added `@playwright/test` package to enable E2E test execution
- Enhanced CI/CD workflow with additional quality checks:
  - TypeScript type checking via `npm run check`
  - Code formatting validation via `npm run format:check`
  - Comprehensive linting via `npm run lint`

### Fixed

- Fixed TypeScript type errors with `NodeJS.Timeout` by replacing with `ReturnType<typeof setTimeout>`
  - Applied fix to `EmojiGrid.tsx`, `SearchBar.tsx`, `FilterBar.tsx`, and `useDebounce.ts`
- Fixed Button component TypeScript typing to support both anchor and button element props
  - Separated `AnchorProps` and `NativeButtonProps` types
  - Allows `target` attribute on anchor-based buttons
- Removed unused imports and variables
  - Removed unused `emitESMImage` import from `EmojiDescription.tsx`
  - Removed unused `useCallback` import from `useVirtualScroll.ts`
  - Prefixed unused variables with underscore to comply with linting rules
- Fixed `useVirtualScroll` hook to properly export `containerRef` in return type
- Changed `let` to `const` for non-reassigned variables in `app.js` and test files
- Changed `console.log` to `console.warn` to comply with console linting rules
- Code formatting standardization across all source files via Prettier

### Changed

- Updated GitHub Actions CI workflow (`ci.yml`) to include:
  - TypeScript check step before linting
  - Code formatting check before build
  - Improved job naming from "Lint and Build" to reflect all quality checks

## [1.1.1] - 2026-06-01

### Fixed

- Removed noisy console logging from the extension popup and improved clipboard feedback UX.
- Prevented full popup reload when toggling favorites; DOM updates now happen in-place.
- Bumped extension manifest `version` to semver-compliant `1.0.0`.
- Bumped project `package.json` patch version to `1.1.1`.

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

[Unreleased]: https://github.com/narainkarthikv/nmoji/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/narainkarthikv/nmoji/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/narainkarthikv/nmoji/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/narainkarthikv/nmoji/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/narainkarthikv/nmoji/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/narainkarthikv/nmoji/releases/tag/v1.0.0
