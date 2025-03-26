/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getHighlighter, bundledLanguages } from 'shiki'
import { theme } from './theme'
import sentinelGrammar from './languages/sentinel.tmGrammar.json'

// Shiki's TypeScript types are broken, so we silence the error with `$TSFixMe`.
const sentinel = { ...sentinelGrammar, name: 'sentinel' } as $TSFixMe

// !! Note: the syntax highlighting is done through the theme, which is a textmate grammar which define token scope. You can inspect textmate scope in VSCode executing the command `Developer: Inspect Editor Tokens and Scopes` !!

// This function is used to highlight code blocks on the product install pages.
export async function highlightString(
	code: string,
	lang: string
): Promise<string> {
	const highlighter = await getHighlighter({
		langs: [lang === 'sentinel' ? sentinel : lang],
		themes: [theme],
	})

	const html = highlighter.codeToHtml(code, {
		lang,
		theme: theme.name,
		transformers: [
			{
				// Remove the wrapping pre and code elements since we render
				// those ourselves.
				root(node) {
					node.children = this.code.children
				},
			},
		],
	})

	return html
}

export const defaultShikiOptions = {
	themes: { light: theme },
	langs: [...Object.keys(bundledLanguages), sentinel],
}
