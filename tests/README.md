# Playwright E2E Tests for nMoji

This directory contains end-to-end (E2E) tests for the nMoji emoji picker application using Playwright.

## Overview

The test suite includes 5 comprehensive test files covering:

1. **Smoke Tests** (`smoke.spec.ts`) - Basic functionality and initial load verification
2. **Search Functionality** (`search.spec.ts`) - Emoji search and filtering tests
3. **Emoji Interaction** (`emoji-interaction.spec.ts`) - Emoji selection and copy functionality
4. **Navigation & UI** (`navigation.spec.ts`) - Navigation flow and UI structure tests
5. **Responsive Design** (`responsive.spec.ts`) - Multi-viewport and responsive behavior tests

## Test Coverage

### Smoke Tests (5 tests)
- Application loads successfully
- No console errors on initial load
- Emoji grid renders correctly
- Search bar component is visible
- Responsive layout works on mobile

### Search Functionality (5 tests)
- Search for valid emoji keyword displays results
- Clear search and show all emojis
- Handle empty search results gracefully
- Real-time search with debouncing
- Maintain search state after page interaction

### Emoji Interaction (6 tests)
- Select emoji on click
- Copy emoji to clipboard
- Display emoji details when selected
- Handle multiple emoji selections
- Support keyboard navigation for emoji selection

### Navigation & UI (6 tests)
- Navigate to home page
- Navigate to app page
- Remain functional after page refresh
- Have accessible navigation structure
- Support keyboard navigation throughout app
- Maintain URL structure across navigation

### Responsive Design (6 tests)
- Render correctly on mobile (375px)
- Render correctly on tablet (768px)
- Render correctly on desktop (1920px)
- Handle viewport resize correctly
- Support touch interactions on mobile
- Scale properly across different screen sizes

**Total: 28 test cases**

## Installation

Playwright is already installed as a dev dependency. If you need to reinstall:

```bash
npm install -D @playwright/test
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests with UI mode
```bash
npm run test:e2e:ui
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test tests/smoke.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
```

### View test report
```bash
npm run test:e2e:report
```

## Configuration

The Playwright configuration is defined in `playwright.config.ts`:

- **Test Directory**: `tests/`
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium (Desktop and Mobile)
- **Report Formats**: HTML, JUnit XML, Console output
- **Screenshots**: Captured on test failure only
- **Traces**: Recorded on first retry for debugging
- **Timeout**: 30 seconds per test

## Environment

- **Node.js**: 18.x or newer
- **npm**: 9.x or newer
- **Astro**: 5.x
- **Playwright**: Latest (@playwright/test)

## Development Workflow

1. **Start the dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Run tests** in another terminal:
   ```bash
   npm run test:e2e
   ```

3. **View results** in the HTML report:
   ```bash
   npm run test:e2e:report
   ```

## Continuous Integration

Tests are configured to run in CI with:
- Single worker process (no parallelization)
- 2 retries for flaky tests
- Full test output on failure
- HTML and JUnit XML reports

When `CI` environment variable is set, tests will:
- Not reuse existing dev server
- Retry failed tests twice
- Run in single-worker mode
- Generate CI-compatible reports

## Debugging Tests

### Visual debugging in UI mode
```bash
npm run test:e2e:ui
```

### Step through tests in debug mode
```bash
npm run test:e2e:debug
```

### View test traces (after failed test)
- Traces are saved in `trace.zip` after first retry
- Open with: `npx playwright show-trace <path-to-trace.zip>`

### Screenshots on failure
- Automatically saved to `test-results/` directory
- Disabled by default in local development
- Enable with: `--screenshot=on`

## Best Practices

1. **Keep tests independent**: Each test should not depend on state from other tests
2. **Use explicit waits**: Wait for specific elements rather than arbitrary delays
3. **Avoid test interdependence**: Tests should be runnable in any order
4. **Use descriptive names**: Test names should clearly describe what they test
5. **Handle dynamic content**: Search results, API responses may vary
6. **Test user workflows**: Focus on how users interact with the app

## Troubleshooting

### Tests timeout
- Increase `timeout` in `playwright.config.ts`
- Check if dev server is running on port 3000
- Verify network connectivity

### Tests fail in CI but pass locally
- May be related to timing/race conditions
- Use retries for flaky tests
- Check traces and screenshots in CI reports

### Browser not found
- Install browsers: `npx playwright install`
- Install system dependencies: `npx playwright install-deps`

### Port 3000 already in use
- Change port in `astro.config.mjs`
- Update `baseURL` in `playwright.config.ts` to match

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Add appropriate `beforeEach` hooks for setup
4. Include proper waits for async operations
5. Add comments for complex test logic
6. Ensure tests are deterministic and not flaky
7. Update this README with new test descriptions

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)
