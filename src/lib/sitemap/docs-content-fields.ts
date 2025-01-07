/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { makeSitemapField } from './helpers'

export async function allDocsFields() {
	const getContentAPIDocsPaths = await fetch(
		`${process.env.MKTG_CONTENT_DOCS_API}/api/all-docs-paths`
	)
	const { result: contentAPIDocsResult } = await getContentAPIDocsPaths.json()

	// If there are docs that have been migrated to the unified docs repo, get the paths for those docs
	// and merge them with the paths for the docs that haven't been migrated from the content API
	if (
		process.env.HASHI_ENV === 'unified-docs-sandbox' &&
		__config.flags?.unified_docs_migrated_repos.length > 0
	) {
		const productsFilter = __config.flags.unified_docs_migrated_repos.map(
			(repo) => {
				return `products=${repo}`
			}
		)
		const productsFilterString = productsFilter.join('&')
		const getUDRDocsPaths = await fetch(
			`${process.env.UNIFIED_DOCS_API}/api/all-docs-paths?${productsFilterString}`
		)
		const { result: udrDocsResult } = await getUDRDocsPaths.json()

		// Filter the result from the content API to take out the duplicate paths between
		// the content API and UDR
		const filteredContentAPIDocsResult = contentAPIDocsResult.filter(
			(item: { path: string; created_at: string }) => {
				return !udrDocsResult.find(
					(URDItem: { path: string; created_at: string }) => {
						return URDItem.path === item.path
					}
				)
			}
		)

		const allDocsData = [...filteredContentAPIDocsResult, ...udrDocsResult]
		return allDocsData.map((page: { path: string; created_at: string }) =>
			makeSitemapField({
				slug: `${page.path}`,
				lastmodDate: page.created_at,
			})
		)
	}

	return contentAPIDocsResult.map(
		(page: { path: string; created_at: string }) =>
			makeSitemapField({
				slug: `${page.path}`,
				lastmodDate: page.created_at,
			})
	)
}
