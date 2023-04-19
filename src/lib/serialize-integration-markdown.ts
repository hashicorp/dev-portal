/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'
import { paragraphCustomAlerts, typography } from '@hashicorp/remark-plugins'
import rehypePrism from '@mapbox/rehype-prism'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeSanitize, { schema } from 'lib/remark-plugins/rehype-sanitize'
import remarkPluginAnchorLinkData from 'lib/remark-plugins/remark-plugin-anchor-link-data'
// Types
import type { AnchorLinkItem } from 'lib/remark-plugins/remark-plugin-anchor-link-data'

export default async function serializeIntegrationMarkdown(
	markdown: string,
	anchorLinks: AnchorLinkItem[] = []
): Promise<MDXRemoteSerializeResult> {
	// TODO: export types from `next-mdx-remote` v3
	const SERIALIZE_OPTIONS: Parameters<typeof serialize>[1] = {
		mdxOptions: {
			remarkPlugins: [
				[remarkPluginAnchorLinkData, { anchorLinks }],
				paragraphCustomAlerts,
				typography,
			],
			rehypePlugins: [
				[rehypePrism, { ignoreMissing: true }],
				rehypeSurfaceCodeNewlines,
				[rehypeSanitize, schema],
			],
		},
	}
	return await serialize(markdown, SERIALIZE_OPTIONS)
}
