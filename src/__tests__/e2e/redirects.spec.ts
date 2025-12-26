/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { test, expect } from '@playwright/test'

test('should use dev portal redirects', async ({ page, context, baseURL }) => {
	await page.goto('/hashicorp-cloud-platform')
	const { pathname } = new URL(page.url())
	expect(pathname).toBe('/hcp')
})
