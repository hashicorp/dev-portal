import path from 'path'
import { Definition, Link } from 'mdast'

const getIsInternalPath = (url: string) => {
	try {
		new URL(url)
		return false
	} catch (e) {
		return true
	}
}

/**
 * Handles processing a Link or Definition node in documentation content. Returns
 * the adjusted node URL.
 */
const processDocsLinkNode = ({
	node,
	currentPath,
	urlAdjustFn,
}: {
	node: Link | Definition
	currentPath: string
	urlAdjustFn: (url: string) => string
}) => {
	const urlToAdjust = preAdjustUrl({ currentPath, url: node.url })
	return urlAdjustFn(urlToAdjust)
}

/**
 * Handles folder-relative URLs that start with the "dot-dot" (..) syntax. This
 * syntax is used to link to a parent, grandparent, etc. from the current path.
 */
const handleDotDotFolderRelativeUrl = ({
	currentPathParts,
	urlParts,
}: {
	currentPathParts: string[]
	urlParts: string[]
}) => {
	// First, count how many dot-dot parts there are
	let numDotDotParts = 0
	urlParts.forEach((part: string) => {
		if (part === '..') {
			numDotDotParts += 1
		}
	})

	// Slice off (from the end) the levels we don't want from the current path
	const newCurrentPathParts = currentPathParts.slice(0, -(numDotDotParts + 1))

	// Remove all the dot-dot parts from the url
	const newUrlParts = urlParts.slice(numDotDotParts)

	// Join all the parts together
	const newUrl = [...newCurrentPathParts, ...newUrlParts].join('/')

	// Return the new url
	return newUrl
}

/**
 * Handles folder-relative URLs that start with the "dot-slash" (./) syntax.
 * This syntax is used to link to a child, grandchild, etc. from the current
 * path.
 */
const handleDotSlashFolderRelativeUrl = ({
	currentPath,
	url,
}: {
	currentPath: string
	url: string
}) => {
	// Remove the leading dot-slash from the url
	const urlWithOutDotSlash = url.slice('./'.length)

	// Concatenate the current path and url (without the dot-slash)
	const newUrl = path.join(currentPath, urlWithOutDotSlash)

	// Return the new url
	return newUrl
}

/**
 * Pre-adjusts urls that start with a path part of the given `currentPath`. See
 * examples in: `src/lib/__tests__/remark-plugin-adjust-link-urls.test.ts`.
 */
const preAdjustUrl = ({ currentPath, url }): string => {
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

	// Handle folder-relative URL that is linking upwards
	if (url.startsWith('../')) {
		return handleDotDotFolderRelativeUrl({ currentPathParts, urlParts })
	}

	// Handle folder-relative URL that is linking downwards
	if (url.startsWith('./')) {
		return handleDotSlashFolderRelativeUrl({ currentPath, url })
	}

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

	// Retain parts of currentPath, up to the first part of the url
	const currentPathPartsToRetain = currentPathParts.slice(0, indexInCurrentPath)

	// Concatentate the retained parts of currentPath, and all parts of url
	const allJoinedParts = [...currentPathPartsToRetain, ...urlParts].join('/')

	// Return the concatentated parts
	return allJoinedParts
}

export {
	handleDotDotFolderRelativeUrl,
	handleDotSlashFolderRelativeUrl,
	preAdjustUrl,
	processDocsLinkNode,
}
