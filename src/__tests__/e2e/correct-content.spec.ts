/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { test, expect } from '@playwright/test'

// @ts-expect-error - import json
import table from './path-h1s.json'

test.describe.configure({ mode: 'parallel' })

// TO RUN THIS TEST AGAINST A VERCEL DEPLOYMENT:
// Set the `E2E_BASE_URL` env var and run `npm run test:e2e`
// ex.
// - E2E_BASE_URL=https://dev-portal-b4m2mbrt6-hashicorp.vercel.app npm run test:e2e

// This is an integration test with the downstream `learn-api`.
// This test primarily exists to ensure paths render correct tutorials. Incorrect tutorials have
// been observed on deployed environments when upgrading Next.js from `>= 13.1.7-canary.14`
for (const row of table) {
	const [path, firstH1] = row

	test.only(`${path} should contain h1 (${firstH1})`, async ({ page }) => {
		await page.goto(path)
		const h1 = await page.waitForSelector('h1')
		const text = await h1.innerText()
		expect(text).toEqual(firstH1)
	})
}
