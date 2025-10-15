/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import { Element } from 'hast'

/**
 * A tiny rehype plugin used for debugging that logs whenever a `code`
 * element is encountered in the hast tree. It mirrors the behavior of the
 * remark plugin `remark-check-code-element.ts` but operates on HTML nodes.
 */
const rehypeCheckCodeElements: Plugin = (): Transformer => {
	function addClassName(node: Element, className: string) {
		if (!className) return
		// ensure .properties exists so callers can set arbitrary metadata
		if (!node.properties) node.properties = {}

		// Normalize and append className in a safe way. Convert any incoming
		// values to strings to satisfy the `Properties` types and avoid `any`.
		const existingClassName = node.properties && node.properties.className
		if (existingClassName && Array.isArray(existingClassName)) {
			node.properties.className = [...existingClassName, className]
		} else {
			node.properties.className = [className]
		}
	}

	return function transformer(tree) {
		visit(tree, 'element', (node: Element) => {
			const tag = (node.tagName || '').toLowerCase()

			if (tag !== 'inlinecode') {
				return
			}

			// eslint-disable-next-line no-console
			console.log("it's a rehype code element", node.properties)

			addClassName(node, 'my-code-class')
		})
	}
}

export { rehypeCheckCodeElements }
