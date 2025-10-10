/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import getLatestContentShaForProduct from '../get-latest-content-sha-for-product'
import fetchGithubFile from '@build-libs/fetch-github-file'
import { PRODUCT_REDIRECT_ENTRIES } from '@build-libs/redirects'
import { loadHashiConfigForEnvironment } from '../../config'

describe('getLatestContentShaForProduct', async () => {
	const config = await loadHashiConfigForEnvironment()

	PRODUCT_REDIRECT_ENTRIES
		.filter(({ repo }) => !config['flags.unified_docs_migrated_repos'].includes(repo)) // skip repos we don't have access to
		.forEach(({ repo, path }) => {
			if (repo === 'hvd-docs') {
				console.log(`Skipping test for repo "${repo}"`)
			} else {
				it(`fetches the latest SHA for the "${repo}" repo`, async () => {
				const latestSha = await getLatestContentShaForProduct(repo)
				expect(typeof latestSha).toBe('string')
			})
		}
		if (
			['hcp-docs', 'sentinel', 'terraform-enterprise', 'hvd-docs'].includes(
				repo
			)
		) {
			console.log(`Skipping test for private repo "${repo}"`)
		} else {
			it(`fetches the latest SHA for the "${repo}" repo, then validates the SHA by fetching redirects`, async () => {
				const latestSha = await getLatestContentShaForProduct(repo)
				expect(typeof latestSha).toBe('string')
				const redirectsFileString = await fetchGithubFile({
					owner: 'hashicorp',
					repo: repo,
					path: path,
					ref: latestSha,
				})
				expect(typeof redirectsFileString).toBe('string')
			})
		}
	})
})
