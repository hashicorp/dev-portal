/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { Definition, Link } from 'mdast'

const getIsInternalPath = (url: string) => {
	try {
		new URL(url)
		return false
	} catch {
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
 * Handles processing full URLs that may or may not be external to dev dot. If
 * the URL is under the developer.hashicorp.com hostname, then the URL is
 * returned as an internal path to dev dot. Otherwise, URLs that are totally
 * external to dev dot are returned as-is.
 */
const handleFullUrl = ({ url }) => {
	// Construct a URL object
	const { hostname, pathname = '', search = '', hash = '' } = new URL(url)

	// If it's a developer.hashicorp.com url, return it as an internal path
	if (hostname === 'developer.hashicorp.com') {
		return `${pathname}${search}${hash}`
	}

	// Otherwise, there is nothing to pre-adjust for external URLs
	return url
}

/**
 * Handles folder-relative URLs that start with the "dot-dot" (../) syntax. This
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
	currentPathParts,
	url,
}: {
	currentPathParts: string[]
	url: string
}) => {
	// Remove the leading dot-slash from the url
	const urlWithOutDotSlash = url.slice('./'.length)

	// Remove the last part of the currentPath
	const currentPathWithoutLastPart = currentPathParts.slice(0, -1).join('/')

	// Concatenate the current path and url (without the dot-slash)
	const newUrl = path.join(currentPathWithoutLastPart, urlWithOutDotSlash)

	// Return the new url
	return newUrl
}

/**
 * Handles folder-relative URLs that do not start with any dots syntax or
 * punctuation (e.g., "docs/some/docs/path").
 */
const handleNoDotsFolderRelativeUrl = ({ currentPathParts, url, urlParts }) => {
	// Make a copy of urlParts that we can modify
	const urlPartsCopy = [...urlParts]

	// Do the api -> api-docs base path translation first, if it's needed
	if (urlPartsCopy[0] === 'api') {
		urlPartsCopy[0] = 'api-docs'
	}

	// Search for first part of url within currentPath
	const indexInCurrentPath = currentPathParts.indexOf(urlPartsCopy[0])

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
	const allJoinedParts = [...currentPathPartsToRetain, ...urlPartsCopy].join(
		'/'
	)

	// Return the concatentated parts
	return allJoinedParts
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

	// Handle full URL that may link externally or internally
	const isFullUrl = getIsInternalPath(url) === false
	if (isFullUrl) {
		return handleFullUrl({ url })
	}

	// Do nothing if url is a top-level path
	if (url.startsWith('/')) {
		return url
	}

	// Since they're worth checking, split up url and currentPath
	const urlParts = url.split('/')
	const currentPathWithoutTrailingSlash = currentPath.replace(/\/$/, '')
	const currentPathParts = currentPathWithoutTrailingSlash.split('/')

	// Handle folder-relative URL that is linking upwards
	if (url.startsWith('../')) {
		return handleDotDotFolderRelativeUrl({ currentPathParts, urlParts })
	}

	// Handle folder-relative URL that is linking downwards
	if (url.startsWith('./')) {
		return handleDotSlashFolderRelativeUrl({ currentPathParts, url })
	}

	// Otherwise, handle as a folder-relative URL that does not start with any dots
	return handleNoDotsFolderRelativeUrl({ currentPathParts, url, urlParts })
}

export {
	handleDotDotFolderRelativeUrl,
	handleDotSlashFolderRelativeUrl,
	preAdjustUrl,
	processDocsLinkNode,
}
