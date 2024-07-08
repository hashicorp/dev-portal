/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { serialize } from 'lib/next-mdx-remote/serialize'

/**
 * Prepares marketing content blocks for rendering on the client.
 */
export async function prepareMarketingBlocks(blocks) {
	return await Promise.all(
		blocks.map(async (block) => {
			if (block.type === 'paragraph') {
				return { type: block.type, mdxSource: await serialize(block.text) }
			} else {
				return block
			}
		})
	)
}
