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
			const needsPreAdjustment = isInternalPath && !/^[./?#]/.test(node.url)
			if (needsPreAdjustment) {
				const currentPathParts = currentPath.split('/')
				const urlToChangeParts = node.url.split('/')

				const newPathPrefixParts = []
				currentPathParts.find((currentPathPart) => {
					if (!currentPathPart) {
						return false
					}

					const matchesUrlToChangeFirstPart =
						currentPathPart === urlToChangeParts[0]
					if (!matchesUrlToChangeFirstPart) {
						newPathPrefixParts.push(currentPathPart)
					}

					return matchesUrlToChangeFirstPart
				})

				urlToAdjust = `/${newPathPrefixParts.join('/')}/${node.url}`
			}

			node.url = urlAdjustFn(urlToAdjust)
		})
	}
}

export default remarkPluginAdjustLinkUrls
