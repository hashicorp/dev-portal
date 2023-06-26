import type { Root } from 'mdast'
import type { JSX } from 'remark-mdx'
import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import { getImageDimensions } from './helpers'

export const remarkPluginInjectImageDimensions: Plugin = (): Transformer => {
	return async function transformer(tree: Root) {
		const imageNodesForDimensions = []

		visit(tree, 'image', (node: JSX) => {
			// we only manipulate mktg-content-api src
			if (node.url.startsWith('http')) {
				imageNodesForDimensions.push(node)
			}
		})

		/**
		 * If width and height aren't defined via props by the author, we attempt
		 * to calculate the file dimensions and append those props to the source string
		 *
		 * This involves async tasks so is handled in a separate loop from the 'visit'
		 * where async isn't supported. Taken from suggestion in this issue
		 *  https://github.com/syntax-tree/unist-util-visit-parents/issues/8#issuecomment-1413405543
		 */
		for (const node of imageNodesForDimensions) {
			const url = new URL(node.url)

			const dimensions = await getImageDimensions(node.url)

			if (dimensions) {
				// add as search params
				url.searchParams.append('width', dimensions.width)
				url.searchParams.append('height', dimensions.width)
			}

			console.log(url.toString(), url)
			node.url = url.toString()
		}
	}
}
