import type { Root } from 'mdast'
import type { JSX } from 'remark-mdx'
import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import {
	getSrcSetWithUpdatedPaths,
	getDimensions,
	concatWithWidthAndHeight,
} from './helpers'

/**
 * Explain how images are sourced
 * - they live in tutorials repo
 * - mktg-content-api or local asset server
 *
 * @TODO fix the dev-portal image paths, not a huge issue rn but confusing for debugging
 *
 * - test with real content,
 * - put themed image into staging, test on a preview
 * - document
 * - clean up code
 * - clean up tests
 */

export const PATTERNS = {
	/* Should match something like:
	 * src={{
	 *   dark: 'some-path',
	 *   light: 'some-path-light'
	 * }}
	 */
	src: /src={{[\r\n]*\s*((dark:|light:).*[\r\n]*\s*)+}}/,
	/**
	 * Targets the opening src=, opening and closing brackets {{ }},
	 * quotes ' ", and whitespace, carriage returns, and newlines.
	 */
	jsxAndWhitespace: /src={{|}}|'|"|[\r\n\s]*/g,
	/**
	 * Targets the property / value definitions for light and dark src paths
	 * e.g. dark: 'some-path' or light: "my-path/hi-there"
	 */
	darkProp: /dark:\s*('|").*('|")/,
	lightProp: /light:\s*('|").*('|")/,
}

const remarkPluginCalculateImageDimensions: Plugin = (): Transformer => {
	return async function transformer(tree: Root) {
		const themedImageNodes = []

		visit(tree, 'jsx', (node: JSX) => {
			if (node.value.includes('ThemedImage')) {
				themedImageNodes.push(node)
			}
		})

		for (const node of themedImageNodes) {
			const match = node.value.match(PATTERNS.src)
			// We assume the first item in the array is the full match string
			const src = match?.length > 0 ? String(match[0]) : null
			let value = node.value

			// Return early if no match was found
			if (!src) {
				console.log(
					'[remarkPluginCalculateImageDimensions]: No srcSet found on ThemedImage '
				)
				continue
			}

			// get the correct image paths for mktg-content-api or local asset server
			const srcSet = getSrcSetWithUpdatedPaths(src)

			// update src path definitions in the node value
			value = value.replace(PATTERNS.darkProp, `dark: '${srcSet.dark}'`)
			value = value.replace(PATTERNS.lightProp, `light: '${srcSet.light}'`)

			const dimensions = await getDimensions(srcSet.dark)
			const widthAndHeightDefined =
				value.includes('width') && value.includes('height')

			// only overwrite width and height if not defined & dimensions exist
			if (!widthAndHeightDefined && dimensions) {
				value = concatWithWidthAndHeight(value, dimensions)
			}

			node.value = value
		}
	}
}

export default remarkPluginCalculateImageDimensions
