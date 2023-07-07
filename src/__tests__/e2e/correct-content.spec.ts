/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { test, expect } from '@playwright/test'

/**
 * List of dev-portal paths and expected H1's.
 */
const table = [
	['/hcp/tutorials/networking', 'HashiCorp Virtual Network'],
	['/vault/tutorials/operations/configure-vault', 'Configure Vault'],
	['/consul/tutorials/get-started-hcp/hcp-gs-deploy', 'Deploy HCP Consul'],
]

// This is an integration test with the downstream `learn-api`.
// This test primarily exists to ensure paths render correct tutorials. Incorrect tutorials have
// been observed when upgrading Next.js from `13.0.8` to `13.4.8`
for (const row of table) {
	const [path, firstH1] = row

	test(`the path (${path}) should contain h1 (${firstH1})`, async ({
		page,
	}) => {
		await page.goto(path)
		const h1 = await page.waitForSelector('h1')
		const text = await h1.innerText()
		expect(text).toEqual(firstH1)
	})
}
