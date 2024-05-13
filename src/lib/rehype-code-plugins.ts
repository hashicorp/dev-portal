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
 */
export const rehypeCodePlugins: Pluggable[] = [
	[
		rehypeShiki,
		{
			...defaultShikiOptions,
			transformers: [
				{
					code(node) {
						// Remove the last line if it's just whitespace
						const lastChild = node.children[node.children.length - 1]
						if (
							lastChild.type === 'element' &&
							lastChild.tagName === 'span' &&
							lastChild.children.length === 1 &&
							lastChild.children[0].type === 'text' &&
							lastChild.children[0].value === '\xa0'
						) {
							node.children.pop()
						}

						this.addClassToHast(node, `language-${this.options.lang}`)
					},
					line(node, line) {
						// If the line is empty, add a non-breaking space
						if (node.tagName === 'span' && node.children.length === 0) {
							node.children.push({ type: 'text', value: '\xa0' })
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
							case 'sell-session':
							case 'terminal':
								options.lang = 'shellsession'
								break
							case 'shell-script':
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
					},
				} satisfies ShikiTransformer,
			],
		},
		// unified's Pluggable type is difficult to satisfy, but we know this is
		// the correct declaration for the plugin, so we assert it as any.
	] as any,
]
