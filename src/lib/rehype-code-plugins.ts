/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import rehypeShiki from '@shikijs/rehype'
import { defaultShikiOptions } from 'lib/syntax-highlighting'
import type { Pluggable } from 'unified'
import type { ShikiTransformer } from 'shiki/core'

/**
 * Rehype plugins we use across MDX use cases for code syntax highlighting.
 *
 * TODO: would be great to move this into the `web` monorepo, specifically
 * into `packages/syntax-highlighting`... However, doing so would create an
 * extended feedback loop when making changes (would require publishing a new
 * canary version of that package just to test changes). So, keeping this
 * file here for now.
 */
export const rehypeCodePlugins: Pluggable[] = [
	[
		rehypeShiki,
		{
			...defaultShikiOptions,
			transformers: [
				{
					pre(node) {
						// stripped out during the render phase, as our current CodeBlock component has it's own pre tag
						node.properties.class = [`language-${this.options.lang}`]
						node.properties.language = this.options.lang
					},
					code(node) {
						// Remove empty tokens, these make it hard to render newlines
						node.children = node.children.filter((child) => !isEmptyLine(child))
						this.addClassToHast(node, `language-${this.options.lang}`)
					},
					span(node, _line: number, col: number) {
						// prevent user-select on the start +/- in diff lines
						if (this.options.lang === 'diff' && col === 0) {
							const firstChild = node.children[0] as any

							if (['-', '+'].includes(firstChild?.value)) {
								node.properties.style += '; user-select: none;'
							}
						}
					},
					preprocess(code, options) {
						// Shiki language codes are all lowercase.
						options.lang = options.lang.toLowerCase()

						// Some of our docs reference language codes that Shiki
						// doesn't recognize, and we're unable to modify the
						// highlighter instance given that this plugin is
						// loaded outside of an async context. So instead we
						// manually modify the language code to a known
						// good value.
						switch (options.lang) {
							case 'hcl2':
								options.lang = 'hcl'
								break
							case 'shell-session':
							case 'shell-session#':
							case 'sell-session':
							case 'terminal':
								options.lang = 'shellsession'
								break
							case 'shell-script':
							case 'env':
								options.lang = 'sh'
								break
							case 'patch':
								options.lang = 'diff'
								break
							case 'golang':
								options.lang = 'go'
								break
							case 'log':
							case 'plain-text':
							case 'ebnf':
							case 'rego':
								options.lang = 'text'
								break
						}

						// Finally, if the language is still unknown, default
						// to plaintext, unless the language is explicitly set
						// to `sentinel`, which is in `langs` as an object.
						if (
							!defaultShikiOptions.langs.includes(options.lang) &&
							options.lang !== 'sentinel' &&
							options.lang !== 'text'
						) {
							console.error(
								`ShikiError: Language \`${options.lang}\` not found, you may need to load it first`
							)
							options.lang = 'text'
						}
					},
				} satisfies ShikiTransformer,
			],
		},
		// unified's Pluggable type is difficult to satisfy, but we know this is
		// the correct declaration for the plugin, so we assert it as any.
	] as any,
]

/**
 * Given a node,
 * Return true if the node is empty of text content,
 * or false otherwise.
 */
function isEmptyLine(node): boolean {
	// Base case, our node is empty text
	const isEmptyText = node.type === 'text' && node.value === ''
	if (isEmptyText) {
		return true
	}
	// Base case, our node is a span with zero children
	if (node.tagName === 'span' && node.children.length === 0) {
		return true
	}
	// Recursive case, our node is a span with exactly one child.
	// We return true if this child is an empty node, or false otherwise.
	if (node.tagName === 'span' && node.children.length === 1) {
		return isEmptyLine(node.children[0])
	}
	// Otherwise, our node is not empty
	return false
}
