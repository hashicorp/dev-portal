/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Plugin, Transformer } from 'unified'
import { visit, Node } from 'unist-util-visit'
import { Heading } from 'mdast'
import toString from 'mdast-util-to-string'
import guaranteeUniqueSlug from './guarantee-unique-slug'

export type AnchorLinkItem = {
	id: string
	level: 1 | 2 | 3 | 4 | 5 | 6
	title: string
}

type RemarkPluginAnchorLinkDataOptions = {
	anchorLinks: AnchorLinkItem[]
}

/**
 * Revised version of `anchor-links` from `@hashicorp/remark-plugins`
 * that avoids injecting elements, instead only adding the necessary data
 * for us to render anchor links at a later stage in our process.
 *
 * TODO: write clearer description
 */
const remarkPluginAnchorLinkData: Plugin<
	[RemarkPluginAnchorLinkDataOptions]
> = ({ anchorLinks }: RemarkPluginAnchorLinkDataOptions): Transformer => {
	// this array keeps track of existing slugs to prevent duplicates per-page
	const existingIds = []
	return function transformer(tree: Node) {
		visit(tree, 'heading', (node: Heading) => {
			const level = node.depth
			const title = toString(node)
			// generate the slug and use it as the headline's id property
			const id = guaranteeUniqueSlug(title, existingIds)
			node.data = {
				...node.data,
				hProperties: {
					...(node.data?.hProperties as $TSFixMe),
					id,
					/**
					 * The 'data-text-content' attribute is used for the `aria-label` on
					 * heading permalinks. We use keep only letters, numbers, and spaces,
					 * which allows us to sanitize this property in a more robust way.
					 */
					'data-text-content': title.replace(/[^\w\-\s]+/g, ''),
				},
			}
			//
			const anchorLink = { id, level, title }
			anchorLinks.push(anchorLink)
		})
	}
}

export default remarkPluginAnchorLinkData
