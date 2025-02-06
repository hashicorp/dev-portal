/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { trace } from '@opentelemetry/api'
import type { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
import { serialize } from 'lib/next-mdx-remote/serialize'
import { Pluggable } from 'unified'
import grayMatter from 'gray-matter'

import { remarkRewriteAssets } from 'lib/remark-plugins/remark-rewrite-assets'

interface Options {
	mdxContentHook?: (content: string, scope: Options['scope']) => string
	remarkPlugins?: Pluggable[]
	rehypePlugins?: Pluggable[]
	scope?: Record<string, unknown>
}

async function renderPageMdx(
	mdxFileString: string,
	{
		mdxContentHook = (c, scope) => c,
		remarkPlugins = [],
		rehypePlugins = [],
		scope,
	}: Options = {}
): Promise<{
	mdxSource: MDXRemoteSerializeResult
	frontMatter: Record<string, unknown>
}> {
	const finalRemarkPlugins = remarkPlugins
	if (
		process.env.HASHI_ENV === 'unified-docs-sandbox' &&
		__config.flags?.unified_docs_migrated_repos?.find(
			(product) => product === scope.product
		)
	) {
		console.log('finalRemarkPlugins 1', { finalRemarkPlugins })
		finalRemarkPlugins.push(
			remarkRewriteAssets({
				product: scope.product as string,
				version: scope.version as string,
				getAssetPathParts: (nodeUrl) => [nodeUrl],
				isInUDR: true,
			})
		)
	}

	console.log('finalRemarkPlugins 2', { finalRemarkPlugins })

	return await trace
		.getTracer('docs-view')
		.startActiveSpan('renderPageMdx', async (span) => {
			try {
				const { data: frontMatter, content: rawContent } =
					grayMatter(mdxFileString)
				const content = mdxContentHook(rawContent, scope)
				const mdxSource = await serialize(content, {
					mdxOptions: {
						remarkPlugins: finalRemarkPlugins,
						rehypePlugins,
					},
					scope,
				})
				return { mdxSource, frontMatter }
			} finally {
				span.end()
			}
		})
}

export default renderPageMdx
