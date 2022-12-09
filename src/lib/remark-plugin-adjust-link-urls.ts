import path from 'path'
import { visit } from 'unist-util-visit'
import { Link } from 'mdast'
import { Plugin, Transformer } from 'unified'

const getIsInternalPath = (url: string) => {
	try {
		new URL(url)
		return false
	} catch (e) {
		return true
	}
}

const remarkPluginAdjustLinkUrls: Plugin = ({
	currentPath = '',
	urlAdjustFn,
}: {
	currentPath: string
	urlAdjustFn: (url: string) => string
}): Transformer => {
	return function transformer(tree) {
		visit(tree, ['link', 'definition'], (node: Link) => {
			let urlToAdjust = node.url

			/**
			 * This is to handle links like "variables/input", which are effectively
			 * the same thing as "./input" in the context of its current page.
			 */
			const isInternalPath = getIsInternalPath(node.url)
			const needsPreAdjustment = isInternalPath && /^[./?#]/.test(node.url)
			if (needsPreAdjustment) {
				urlToAdjust = path.join(
					currentPath,
					node.url.split('/').slice(1).join('/')
				)
				console.log({ before: node.url, after: urlToAdjust })
			}

			node.url = urlAdjustFn(urlToAdjust)
		})
	}
}

export default remarkPluginAdjustLinkUrls
