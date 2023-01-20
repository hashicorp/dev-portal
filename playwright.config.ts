import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
	testDir: './src/__tests__/e2e',
	/* Maximum time one test can run for. */
	timeout: 30 * 1000,
	expect: {
		/**
		 * Maximum time expect() should wait for the condition to be met.
		 * For example in `await expect(locator).toHaveText();`
		 */
		timeout: 5000,
	},
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 0,
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
	},

	/* Configure projects for major browsers (https://playwright.dev/docs/test-advanced#projects) */
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},
		{
			name: 'default',
			testIgnore: 'src/__tests__/e2e/docs-content-link-rewrites.spec.ts',
		},
		{
			name: 'docs-content-link-rewrites',
			testMatch: 'src/__tests__/e2e/docs-content-link-rewrites.spec.ts',
			retries: 0,
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: !process.env.E2E_BASE_URL
		? {
				command: 'npm run start',
				port: 3000,
				env: {
					// Run in preview mode to support changing the product based on the
					// hc_dd_proxied_site cookie
					HASHI_ENV: 'preview',
				},
		  }
		: undefined,
}

export default config
