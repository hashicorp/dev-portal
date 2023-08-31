/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Plugin } from 'unified'
import { paragraphCustomAlerts, typography } from '@hashicorp/remark-plugins'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { rehypeCodePlugins } from 'lib/rehype-code-plugins'
import rehypeSanitize, { schema } from 'lib/remark-plugins/rehype-sanitize'
import remarkPluginAnchorLinkData from 'lib/remark-plugins/remark-plugin-anchor-link-data'
// Types
import type { AnchorLinkItem } from 'lib/remark-plugins/remark-plugin-anchor-link-data'

export default async function serializeIntegrationMarkdown(
	markdown: string
): Promise<{
	serializeResult: MDXRemoteSerializeResult
	anchorLinks: AnchorLinkItem[]
}> {
	// TODO: export types from `next-mdx-remote` v3
	// anchorLinks will be mutated by `remarkPluginAnchorLinkData`
	const anchorLinks: AnchorLinkItem[] = []
	const SERIALIZE_OPTIONS: Parameters<typeof serialize>[1] = {
		mdxOptions: {
			remarkPlugins: [
				[remarkPluginAnchorLinkData, { anchorLinks }],
				paragraphCustomAlerts,
				typography,
			],
			rehypePlugins: [
				...rehypeCodePlugins,
				/**
				 * Note: The VFile type definition varies between the newer version of
				 * `rehype-sanitize` we use and the `unified` version used by
				 * `next-mdx-remote`, so casting to `Plugin` here is necessary.
				 */
				[rehypeSanitize as Plugin, schema],
			],
		},
	}
	const serializeResult = await serialize(markdown, SERIALIZE_OPTIONS)
	return { serializeResult, anchorLinks }
}
