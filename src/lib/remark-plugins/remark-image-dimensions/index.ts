import type { Image, Root } from 'mdast'
import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import probe from 'probe-image-size'

export const remarkPluginInjectImageDimensions: Plugin = (): Transformer => {
	return async function transformer(tree: Root) {
		const imageNodesForDimensions = []
		visit(tree, 'image', (node: Image) => {
			// only transform nodes that we can fetch size on
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
			const url = await getUrlWithDimensions(node.url)
			node.url = url
		}
	}
}

export async function getUrlWithDimensions(
	nodeUrl: string
): Promise<string | undefined> {
	const url = new URL(nodeUrl)
	// if width / height already defined in url, return early
	if (url.searchParams.get('width') && url.searchParams.get('height')) {
		return nodeUrl
	}

	const dimensions = await getImageDimensions(nodeUrl)

	if (dimensions) {
		url.searchParams.append('width', dimensions.width)
		url.searchParams.append('height', dimensions.height)
		return url.toString()
	}
}

async function getImageDimensions(src: string) {
	try {
		return await probe(src)
	} catch (e) {
		if (e.statusCode === 404) {
			console.error(
				`[remarkPluginInjectImageDimensions] Image path: ${src} not found, unable to calculate dimensions ` +
					e
			)
			return
		} else {
			throw e
		}
	}
}
