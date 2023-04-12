/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Heading } from 'mdast'
import { Plugin, Transformer } from 'unified'
import { visit, SKIP, Parent, Node } from 'unist-util-visit'

const remarkPluginRemoveH1: Plugin = (): Transformer => {
	return function transformer(tree: Node) {
		visit(
			tree,
			'heading',
			(node: Heading, index: number, parent: Parent | null) => {
				const isH1 = node.type === 'heading' && node.depth === 1
				if (isH1 && parent !== null && parent.hasOwnProperty('children')) {
					// Remove the h1 node from the parent's children array
					parent.children.splice(index, 1)
					/**
					 * Following http://unifiedjs.com/learn/recipe/remove-node/:
					 * Do not traverse `node`, continue at the node now at `index`.
					 */
					return [SKIP, index]
				}
			}
		)
	}
}

export default remarkPluginRemoveH1
