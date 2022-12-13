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
 */
export const preAdjustUrl = ({ currentPath, url }): string => {
	// Do nothing if currentPath or url are falsy (empty, null, undefined, etc.)
	if (!currentPath || !url) {
		return url
	}

	// Do nothing if url is not an internal path
	const isInternalPath = getIsInternalPath(url)
	if (!isInternalPath) {
		return url
	}

	// Do nothing if url is a top-level path
	if (url.startsWith('/')) {
		return url
	}

	// Since they're worth checking, split up url and currentPath
	const urlParts = url.split('/')
	const currentPathParts = currentPath.split('/')

	// Search for first part of url within currentPath
	const indexInCurrentPath = currentPathParts.indexOf(urlParts[0])

	// Do nothing if currentPath does not have the first part of url
	if (indexInCurrentPath === -1) {
		return url
	}

	// Prefix the url with a slash if it starts with the first part of currentPath
	if (indexInCurrentPath === 0) {
		return `/${url}`
	}

	// Retain parts of currentPath before the one that matches first part of url
	const currentPathPartsToRetain = currentPathParts.slice(0, indexInCurrentPath)

	// Join the retained parts of currentPath and all parts of url
	const allJoinedParts = [...currentPathPartsToRetain, ...urlParts].join('/')

	// Return all of the joined parts
	return allJoinedParts
}

const remarkPluginAdjustLinkUrls: Plugin = ({
	currentPath = '',
	urlAdjustFn,
}: {
	currentPath: string
	urlAdjustFn: (url: string) => string
}): Transformer => {
	return function transformer(tree) {
		visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			const urlToAdjust = preAdjustUrl({ currentPath, url: node.url })
			node.url = urlAdjustFn(urlToAdjust)
		})
	}
}

export default remarkPluginAdjustLinkUrls
