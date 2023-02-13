/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'
import { paragraphCustomAlerts, typography } from '@hashicorp/remark-plugins'
import rehypePrism from '@mapbox/rehype-prism'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

// TODO: export types from `next-mdx-remote` v3
const SERIALIZE_OPTIONS: Parameters<typeof serialize>[1] = {
	mdxOptions: {
		remarkPlugins: [paragraphCustomAlerts, typography],
		rehypePlugins: [
			[rehypePrism, { ignoreMissing: true }],
			rehypeSurfaceCodeNewlines,
		],
	},
}

export default async function serializeIntegrationMarkdown(
	markdown: string
): Promise<MDXRemoteSerializeResult> {
	return await serialize(markdown, SERIALIZE_OPTIONS)
}
