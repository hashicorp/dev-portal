/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import getLatestContentShaForProduct from '../get-latest-content-sha-for-product'
import fetchGithubFile from '@build-libs/fetch-github-file'
import { PRODUCT_REDIRECT_ENTRIES } from '@build-libs/redirects'
import { loadHashiConfigForEnvironment } from '../../config'

describe('getLatestContentShaForProduct', () => {
	let entries: { repo: string; path: string }[] = []

	beforeAll(async () => {
		const config = await loadHashiConfigForEnvironment()
		entries = PRODUCT_REDIRECT_ENTRIES.filter(
			({ repo }) =>
				!(config['flags.unified_docs_migrated_repos'] as string[]).includes(
					repo,
				),
		)

		console.log(PRODUCT_REDIRECT_ENTRIES)
		console.log(config['flags.unified_docs_migrated_repos'] as string[])
	})

	it.each(PRODUCT_REDIRECT_ENTRIES.filter(({ repo }) => repo !== 'hvd-docs'))(
		'fetches the latest SHA for the "$repo" repo',
		async ({ repo }) => {
			// Skip repos that were filtered out by the config (entries not populated yet
			// at collection time, so we skip at runtime if not in the allowed set)
			if (!entries.find((e) => e.repo === repo)) {
				return
			}
			const latestSha = await getLatestContentShaForProduct(repo)
			expect(typeof latestSha).toBe('string')
		},
	)

	const PRIVATE_REPOS = [
		'hcp-docs',
		'sentinel',
		'terraform-enterprise',
		'hvd-docs',
	]

	it.each(
		PRODUCT_REDIRECT_ENTRIES.filter(
			({ repo }) => !PRIVATE_REPOS.includes(repo),
		),
	)(
		'fetches the latest SHA for the "$repo" repo, then validates the SHA by fetching redirects',
		async ({ repo, path }) => {
			if (!entries.find((e) => e.repo === repo)) {
				return
			}
			const latestSha = await getLatestContentShaForProduct(repo)
			expect(typeof latestSha).toBe('string')
			const redirectsFileString = await fetchGithubFile({
				owner: 'hashicorp',
				repo: repo,
				path: path,
				ref: latestSha,
			})
			expect(typeof redirectsFileString).toBe('string')
		},
	)
})
