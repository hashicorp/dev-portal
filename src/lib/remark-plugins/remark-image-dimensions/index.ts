import type { Root } from 'mdast'
import type { JSX } from 'remark-mdx'
import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import probe from 'probe-image-size'

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
				url.searchParams.append('width', dimensions.width)
				url.searchParams.append('height', dimensions.height)

				node.url = url.toString()
			}
		}
	}
}

export async function getImageDimensions(src: string) {
	if (!src.startsWith('http')) {
		return
	}

	try {
		return await probe(src)
	} catch (e) {
		if (e.statusCode === 404) {
			console.error(
				'[remarkPluginInjectImageDimensions] Image path not found, unable to calculate dimensions ' +
					e
			)
			return
		} else {
			throw e
		}
	}
}
