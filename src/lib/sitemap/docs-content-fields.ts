/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { makeSitemapField } from './helpers'

export async function allDocsFields(config: typeof __config) {
	// If there are docs that have been migrated to the unified docs repo, get the paths for those docs
	// and merge them with the paths for the docs that haven't been migrated from the content API
	if (config.flags?.unified_docs_migrated_repos?.length > 0) {
		const contentAPIFilter = config.flags.unified_docs_migrated_repos.map(
			(repo) => {
				return `filterOut=${repo}`
			}
		)
		const contentAPIFilterString = contentAPIFilter.join('&')
		const docsPathUrl1 = `${process.env.MKTG_CONTENT_DOCS_API}/api/all-docs-paths?${contentAPIFilterString}`
		console.log("docsPathUrl1", docsPathUrl1, {MKTG_CONTENT_DOCS_API: process.env.MKTG_CONTENT_DOCS_API})
		const getContentAPIDocsPaths = await fetch(docsPathUrl1)
		const { result: contentAPIDocsResult } = await getContentAPIDocsPaths.json()
		console.log({contentAPIDocsResult}) // TODO: delete this
		const UDRFilter = config.flags.unified_docs_migrated_repos.map((repo) => {
			return `products=${repo}`
		})
		const UDRFilterString = UDRFilter.join('&')
		const docsPathUrl2 = `${process.env.UNIFIED_DOCS_API}/api/all-docs-paths?${UDRFilterString}`
		console.log("docsPathUrl2", docsPathUrl2)
		const getUDRDocsPaths = await fetch(docsPathUrl2)
		const { result: udrDocsResult } = await getUDRDocsPaths.json()
		console.log({udrDocsResult})
		const allDocsData = [...contentAPIDocsResult, ...udrDocsResult]
		return allDocsData.map((page: { path: string; created_at: string }) =>
			makeSitemapField(
				{
					slug: `${page.path}`,
					lastmodDate: page.created_at,
				},
				config
			)
		)
	}

	const getContentAPIDocsPaths = await fetch(
		`${process.env.MKTG_CONTENT_DOCS_API}/api/all-docs-paths`
	)
	const { result: contentAPIDocsResult } = await getContentAPIDocsPaths.json()

	return contentAPIDocsResult.map(
		(page: { path: string; created_at: string }) =>
			makeSitemapField(
				{
					slug: `${page.path}`,
					lastmodDate: page.created_at,
				},
				config
			)
	)
}
