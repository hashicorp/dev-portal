import { visit } from 'unist-util-visit'
import { Definition, Link } from 'mdast'
import { Plugin, Transformer } from 'unified'

const getIsInternalPath = (url: string) => {
	try {
		new URL(url)
		return false
	} catch (e) {
		return true
	}
}

/**
 * Pre-adjusts urls that start with a path part of the given `currentPath`. See
 * examples in: `src/lib/__tests__/remark-plugin-adjust-link-urls.test.ts`.
 *
 * NOTE: urls that start with: `.`, `/`, `?`, or `#` are not pre-adjusted. These
 * do not need to be pre-adjusted because they are assumed to be handled by the
 * `urlAdjustFn` given to `remarkPluginAdjustLinkUrls`.
 */
export const preAdjustUrl = ({ currentPath, url }): string => {
	const isInternalPath = getIsInternalPath(url)
	const needsPreAdjustment = isInternalPath && !/^[./?#]/.test(url)
	if (!needsPreAdjustment) {
		return url
	}

	const currentPathParts = currentPath.split('/')
	const urlToChangeParts = url.split('/')

	const newPathPrefixParts = []
	currentPathParts.find((currentPathPart) => {
		if (!currentPathPart) {
			return false
		}

		const matchesUrlToChangeFirstPart = currentPathPart === urlToChangeParts[0]
		if (!matchesUrlToChangeFirstPart) {
			newPathPrefixParts.push(currentPathPart)
		}

		return matchesUrlToChangeFirstPart
	})

	return `/${newPathPrefixParts.join('/')}/${url}`
}

const remarkPluginAdjustLinkUrls: Plugin = ({
	currentPath = '',
	urlAdjustFn,
}: {
	currentPath: string
	urlAdjustFn: (url: string) => string
}): Transformer => {
	console.log(currentPath)
	return function transformer(tree) {
		visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			const urlToAdjust = preAdjustUrl({ currentPath, url: node.url })
			node.url = urlAdjustFn(urlToAdjust)
		})
	}
}

export default remarkPluginAdjustLinkUrls
