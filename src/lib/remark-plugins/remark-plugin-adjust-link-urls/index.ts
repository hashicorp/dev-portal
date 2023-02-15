/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Definition, Link } from 'mdast'
import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import { processDocsLinkNode } from './helpers'

const remarkPluginAdjustLinkUrls: Plugin = ({
	currentPath = '',
	urlAdjustFn,
}: {
	currentPath: string
	urlAdjustFn: (url: string) => string
}): Transformer => {
	return function transformer(tree) {
		visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			node.url = processDocsLinkNode({ node, currentPath, urlAdjustFn })
		})
	}
}

export default remarkPluginAdjustLinkUrls
