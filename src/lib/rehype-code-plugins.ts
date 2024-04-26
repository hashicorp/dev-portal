/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import rehypeShiki from '@shikijs/rehype'
import { defaultShikiOptions } from 'lib/syntax-highlighting'
import type { Pluggable } from 'unified'

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
							lastChild.tagName === 'span' &&
							lastChild.children.length === 1 &&
							lastChild.children[0].value === '\xa0'
						) {
							node.children.pop()
						}
						this.addClassToHast(node, 'language-' + this.options.lang)
					},
					line(node, line) {
						// If the line is empty, add a non-breaking space
						if (node.tagName === 'span' && node.children.length === 0) {
							node.children.push({ type: 'text', value: '\xa0' })
						}
					},
					preprocess(code, options) {
						if (options.lang === 'HCL' || options.lang === 'hcl2') {
							options.lang = 'hcl'
						}

						if (
							options.lang === 'shell-session' ||
							options.lang === 'sell-session'
						) {
							options.lang = 'shellsession'
						}

						if (options.lang === 'shell-script') {
							options.lang = 'sh'
						}

						if (options.lang === 'patch') {
							options.lang = 'diff'
						}

						if (options.lang === 'golang') {
							options.lang = 'go'
						}

						if (options.lang === 'log') {
							options.lang = 'text'
						}

						if (options.lang === 'plain-text') {
							options.lang = 'text'
						}

						if (options.lang === 'ebnf') {
							options.lang = 'text'
						}
					},
				},
			],
		},
	] as any,
]
