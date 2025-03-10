/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Heading } from 'mdast'
import { Plugin, Transformer } from 'unified'
import { visit, SKIP, Parent, Node } from 'unist-util-visit'

/**
 * This plugin removes any `<h1 />` element from the `remark` AST
 * on which it is run.
 */
const remarkPluginRemoveFirstH1: Plugin = (): Transformer => {
	return function transformer(tree: Node) {
		let firstH1Removed = false
		visit(
			tree,
			'heading',
			(node: Heading, index: number, parent: Parent | null) => {
				const isH1 = node.type === 'heading' && node.depth === 1
				if (firstH1Removed === false) {
					if (isH1 && parent !== null && Object.prototype.hasOwnProperty.call(parent, 'children')) {
						// Remove the h1 node from the parent's children array
						parent.children.splice(index, 1)
						// Flag that we've removed the first h1
						firstH1Removed = true
						/**
						 * Following http://unifiedjs.com/learn/recipe/remove-node/:
						 * Do not traverse `node`, continue at the node now at `index`.
						 */
						return [SKIP, index]
					}
				}
			}
		)
	}
}

export default remarkPluginRemoveFirstH1
