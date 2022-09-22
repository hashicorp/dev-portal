import { NavNode } from '@hashicorp/react-docs-sidenav/types'
import isAbsoluteUrl from 'lib/is-absolute-url'
import { MenuItem } from 'components/sidebar'
import path from 'path'
import {
	getIsExternalLearnLink,
	getIsRewriteableDocsLink,
	getTutorialMap,
	rewriteExternalDocsLink,
	rewriteExternalLearnLink,
} from 'lib/remark-plugins/rewrite-tutorial-links/utils'

// TODO: export NavBranch and NavLeaf
// TODO: types from react-docs-sidenav.
// TODO: isNavBranch & isNavLeaf might
// TODO: also make sense to include in the
// TODO: react-docs-sidenav component,
// TODO: maybe in the types.ts file as well.
// TODO: ... or maybe we should move those types
// TODO: into code within this repo, and consolidate
// TODO: them with the MenuItem type?
interface NavBranch {
	title: string
	routes: NavNode[]
}

interface NavLeaf {
	title: string
	path: string
}

// A NavDirectLink allows linking outside the content subpath.
//
// This includes links on the same domain,
// for example, where the content subpath is `/docs`,
// one can create a direct link with href `/use-cases`.
//
// This also allows for linking to external URLs,
// for example, one could link to `https://hashiconf.com/`.
interface NavDirectLink {
	title: string
	href: string
}

function isNavBranch(value: NavNode): value is NavBranch {
	return value.hasOwnProperty('routes')
}

function isNavLeaf(value: NavNode): value is NavLeaf {
	return value.hasOwnProperty('path')
}

function isNavDirectLink(value: NavNode): value is NavDirectLink {
	return value.hasOwnProperty('href')
}

let TUTORIAL_MAP

/**
 * Prepares all sidebar nav items for client-side rendering. Keeps track of the
 * index of each node using `startingIndex` and the `traversedNodes` property
 * returned from `prepareNavNodeForClient`. Also returns its own
 * `traversedNodes` since it is recursively called in `prepareNavDataForClient`.
 */
async function prepareNavDataForClient({
	basePaths,
	nodes,
	startingIndex = 0,
}: {
	basePaths: string[]
	nodes: NavNode[]
	startingIndex?: number
}): Promise<{ preparedItems: MenuItem[]; traversedNodes: number }> {
	const preparedNodes = []

	TUTORIAL_MAP = TUTORIAL_MAP ?? (await getTutorialMap())

	let count = 0
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i]
		const result = await prepareNavNodeForClient({
			basePaths,
			node,
			nodeIndex: startingIndex + count,
		})
		if (result) {
			const { preparedItem, traversedNodes } = result
			preparedNodes.push(preparedItem)
			count += traversedNodes
		}
	}

	return { preparedItems: preparedNodes, traversedNodes: count }
}

/**
 * Prepares a single sidebar nav item for client-side rendering. All items will
 * have an auto-generated `id` added to them based on `nodeIndex` (which is the
 * index of the current node being prepared) unless they have the "hidden"
 * property set to TRUE. Returns the number of nodes it has traversed
 * (`traversedNodes`) to help `prepareNavDataForClient` keep track of node
 * indices.
 *
 * How different types of items are prepared:
 *  - If the item is a submenu, its child items will be prepared as well.
 *  - If the item is a link with the `path` property, then its `fullPath`
 *    property will be generated from `basePaths` and `path`.
 *  - If the item is a link with the `href` property and the `href` is an
 *    internal path, then the object is "reset" to have the `path` and
 *    `fullPath` properties.
 *  - Otherwise, nothing is added to an item but a unique `id`.
 */
async function prepareNavNodeForClient({
	basePaths,
	node,
	nodeIndex,
}: {
	node: NavNode
	basePaths: string[]
	nodeIndex: number
}): Promise<{ preparedItem: MenuItem; traversedNodes: number }> {
	/**
	 * TODO: we need aligned types that will work here. NavNode (external import)
	 * does not allow the `hidden` property.
	 *
	 * ref: https://app.asana.com/0/1201010428539925/1201602267333015/f
	 */
	if ((node as any).hidden) {
		return null
	}

	// Generate a unique ID from `nodeIndex`
	const id = `sidebar-nav-item-${nodeIndex}`

	if (isNavBranch(node)) {
		// For nodes with routes, add fullPaths to all routes, and `id`
		const { preparedItems, traversedNodes } = await prepareNavDataForClient({
			basePaths,
			nodes: node.routes,
			startingIndex: nodeIndex + 1,
		})
		const preparedItem = {
			...node,
			id,
			routes: preparedItems,
		}
		return {
			preparedItem,
			traversedNodes: traversedNodes + 1,
		}
	} else if (isNavLeaf(node)) {
		/**
		 * For nodes with paths, add fullPath to the node, and `id`
		 * Note: pathWithIndexFix is a stopgap, `index` items should
		 * really be fixed up in content. At some point in the future,
		 * we could add a warning or error here, or resolve this
		 * through content conformance efforts.
		 */
		const pathWithIndexFix = node.path == 'index' ? '' : node.path
		const preparedItem = {
			...node,
			path: pathWithIndexFix,
			fullPath: `/${basePaths.join('/')}/${pathWithIndexFix}`,
			id,
		}
		return { preparedItem, traversedNodes: 1 }
	} else if (isNavDirectLink(node)) {
		// Check if there is data that disagrees with DevDot's assumptions.
		// This can happen because in the context of dot-io domains,
		// authors may write NavDirectLinks with href values that are
		// internal to the site, but outside the current docs route.
		// For example, an author working in the Consul sidebar may
		// create a NavDirectLink with an href of "/downloads".
		// Here in DevDot, we want this URL to be "/consul/downloads",
		// and we want to use an internal rather than external link.
		const hrefIsNotAbsolute = !isAbsoluteUrl(node.href)
		if (hrefIsNotAbsolute) {
			/**
			 * If we have a non-absolute NavDirectLink,
			 * convert it to a NavLeaf node, and treat it similarly.
			 */
			const fullPath = fullPathFromRelativeHref(node.href, basePaths)
			const preparedItem = {
				...node,
				fullPath,
				href: null,
				id,
				path: node.href,
			}
			return { preparedItem, traversedNodes: 1 }
		} else {
			// Otherwise, this is a genuinely external NavDirectLink,
			// so we only need to add an `id` to it.
			const preparedItem = { ...node, id }

			/**
			 * Rewrite external Learn and Docs links if needed. Default to the
			 * original `href`.
			 *
			 * 	- learn.hashicorp.com
			 * 	- vaultproject.io
			 * 	- waypointproject.io
			 */
			try {
				let newHref
				const urlObject = new URL(node.href)
				if (getIsExternalLearnLink(node.href)) {
					newHref = rewriteExternalLearnLink(urlObject, TUTORIAL_MAP)
				} else if (getIsRewriteableDocsLink(node.href)) {
					newHref = rewriteExternalDocsLink(urlObject)
				}

				if (newHref) {
					preparedItem.href = newHref
				}
			} catch (error) {
				console.error(
					`[prepareNavNodeForClient] error in checking for external Learn/Docs link rewrite: ${JSON.stringify(
						{ error, node }
					)}`
				)
			}

			return { preparedItem, traversedNodes: 1 }
		}
	} else {
		// Otherwise return the node unmodified
		const preparedItem = { ...node, id }
		return { preparedItem, traversedNodes: 1 }
	}
}

/**
 * Given a relative `href`, expected to be constructed for dot-io contexts,
 * as well as the current `basePaths`,
 * Return a `fullPath` for use with the Dev Dot URL structure.
 *
 * @param href A relative URL
 * @param basePaths The current set of basePaths
 */
function fullPathFromRelativeHref(href: string, basePaths: string[]): string {
	let fullPath
	if (href.startsWith(`/${basePaths[0]}/`)) {
		/**
		 * If the path already starts with the basePaths[0], the product slug,
		 * we use the href as the fullPath directly.
		 */
		fullPath = href
	} else if (href.startsWith('/')) {
		/**
		 * If the path starts with a slash, we treat it as relative
		 * to the previous dot-io setup. We prefix it with basePaths[0],
		 * which should be the product slug.
		 */
		fullPath = `/${path.join(basePaths[0], href)}`
	} else {
		/**
		 * If the path does not start with a slash, we treat it as relative
		 * to the combined current basePath.
		 */
		fullPath = `/${path.join(basePaths.join('/'), href)}`
	}
	return fullPath
}

export { fullPathFromRelativeHref }
export default prepareNavDataForClient
