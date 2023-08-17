import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import { Code } from 'mdast'

/**
 * Visit all code blocks, and replace any aliased language strings with
 * their canonical values.
 */
export const remarkPluginLanguageAlias: Plugin = ({
	alias,
}: {
	alias: Record<string, string | string[]>
}): Transformer => {
	return function transformer(tree) {
		visit(tree, ['code'], (node: Code) => {
			for (const [canonical, target] of Object.entries(alias)) {
				// Normalize the target alias values to an array
				const aliasArray = typeof target === 'string' ? [target] : target
				if (aliasArray.includes(node.lang)) {
					// Replace the language metastring with the canonical value
					node.lang = canonical
					continue // we found a matched aliasKey, no point in checking others
				}
			}
		})
	}
}
