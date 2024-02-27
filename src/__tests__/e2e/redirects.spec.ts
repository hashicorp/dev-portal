/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { test, expect } from '@playwright/test'

test('should use dev portal redirects', async ({ page, context, baseURL }) => {
	await page.goto('/hashicorp-cloud-platform')
	const { pathname } = new URL(page.url())
	expect(pathname).toBe('/hcp')
})

test('check redirect', async ({ page }) => {
	await page.goto('/waypoint/commands')
	expect(page.url()).toBe(
		'https://github.com/hashicorp/waypoint/blob/main/website/content/commands/index.mdx'
	)
})
