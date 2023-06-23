import type { Root } from 'mdast'
import type { JSX } from 'remark-mdx'
import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import {
	getSrcSetWithUpdatedPaths,
	getImageDimensions,
	concatWithWidthAndHeight,
} from './helpers'

/**
 * This plugin rewrites the ThemedImage content source to be consumed by dev portal.
 *
 * The source content needs to be adjusted in two ways:
 *  - The image src paths reference the tutorials repo paths and need to be adjusted
 *  - We use next/image and need to calculate the dimensions of the asset if possible
 *
 * This Plugin targets a 'jsx' node whose value is a plain string. The string is manipulated
 * via a regexes to manually update the component props to their final values.
 *
 * Note that when we migrate to MDX V2, we will be able to use the parsed JSX node, not just
 * a plain string. This plugin can be incredibly simplified when that migration occurs.
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

const remarkPluginThemedImageSrcAndDimensions: Plugin = (): Transformer => {
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

			if (!src) {
				console.log(
					'[remarkPluginThemedImageSrcAndDimensions]: No srcSet found on ThemedImage '
				)
				continue
			}

			/**
			 * Tutorial images dont live in this repository, so we need to calculate
			 * the correct path and update the source string
			 */
			const srcSet = getSrcSetWithUpdatedPaths(src)
			value = value.replace(PATTERNS.darkProp, `dark: '${srcSet.dark}'`)
			value = value.replace(PATTERNS.lightProp, `light: '${srcSet.light}'`)

			/**
			 * If width and height aren't defined via props by the author, we attempt
			 * to calculate the file dimensions and append those props to the source string
			 */

			const widthAndHeightDefined =
				value.includes('width') && value.includes('height')
			const dimensions = await getImageDimensions(srcSet.dark)

			if (!widthAndHeightDefined && dimensions) {
				value = concatWithWidthAndHeight(value, dimensions)
			}

			node.value = value
		}
	}
}

export default remarkPluginThemedImageSrcAndDimensions
