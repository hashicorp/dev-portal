import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import type { MenuItem } from 'components/sidebar'
import { getParentRootDocsPath } from 'lib/docs/get-parent-root-docs-path'
import { ProductData } from 'types/products'
import { BreadcrumbLink } from '..'
import getFallbackTitle from './get-fallback-title'

const IS_DEV = process.env.NODE_ENV !== 'production'

interface GetPathBreadcrumbsOpts {
	/**
	 * The base path for the current route, if applicable. For example, "docs".
	 * Returned breadcrumb links will be prefixed with this path.
	 */
	basePath: string

	/**
	 * An array of nav nodes, as defined by our sidenav component.
	 */
	navData: MenuItem[]

	/**
	 * An array of parameters representing the path from the basePath to the
	 * current path.
	 */
	pathParts: string[]

	/**
	 * The currently viewed version, obtained by `getDocsBreadcrumbs`
	 */
	version?: string
}

/**
 * Given a basePath, navData, and array of path parameters,
 * Return an array of breadcrumb links leading to this page.
 *
 * Note that the returned array does not include links beyond
 * the basePath. So, in many use cases, consumers will likely
 * want to prefix this array to provide a more complete
 * list of breadcrumb links.
 */
function getPathBreadcrumbs({
	basePath,
	navData,
	pathParts,
	version,
}: GetPathBreadcrumbsOpts): BreadcrumbLink[] {
	// Create an array of all successive combinations
	// of the path parts leading to this page.
	// Each item in this array represents a breadcrumb link.
	const breadcrumbPaths = []
	for (let i = 0; i < pathParts.length; i++) {
		breadcrumbPaths.push(pathParts.slice(0, i + 1).join('/'))
	}

	// Map each each breadcrumb path to its
	// associated navData node. This gets slightly
	// complex due to index (aka "Overview") nodes.
	// Automatically handles when a path contains
	// a version.
	const breadcrumbNodes = breadcrumbPaths.map((path) => {
		let pathToMatch
		if (version) {
			pathToMatch = `${version}/${path}`
		} else {
			pathToMatch = path
		}
		return getPathMatchedNode(navData, pathToMatch, basePath)
	})

	// Map the matched navData nodes into { title, url }
	// objects as needed for breadcrumb link rendering.
	return breadcrumbNodes.map(({ title, path }) => {
		const link = { title } as BreadcrumbLink
		if (path) {
			link.url = `/${basePath}/${path}`
		}
		if (path == pathParts.join('/')) {
			link.isCurrentPage = true
		}
		return link
	})
}

function getPathMatchedNode(navNodes, pathString, basePath) {
	const matches = findAllPathMatchedNodes(navNodes, pathString)
	// If we have exactly one match, this is great, and expected
	if (matches.length == 1) {
		return matches[0]
	}
	// If we do not have exactly one match, we likely
	// have a problem with the navData that was not caught
	// by our docs-sidenav validation functions, and we should address it.
	// ..
	// If navData has ambiguous matches, warn in development.
	// We can fallback to returning the first match, and this should
	// be fine from a visitor perspective. Less urgent to fix these types of issues.
	if (matches.length > 1) {
		if (IS_DEV) {
			console.warn(
				`Ambiguous breadcrumb path under "${basePath}": Found ${matches.length} matches for "${pathString}". Please ensure there is exactly one node or index-less category with the path "${pathString}" in the provided navData.`
			)
		}
		return matches[0]
	}
	// Otherwise, we have zero matches, which would mean a breadcrumb with missing parts.
	// We have no nav-data to render a nice "title" for the breadcrumb bar, and
	// there isn't a matched path to link to, but we can still render an
	// unlinked breadcrumb item using fallback title text
	if (IS_DEV) {
		console.warn(
			`Missing breadcrumb path under "${basePath}": Found zero matches for "${pathString}". Please ensure there is a node (or index-less category) with the path "${pathString}" in the provided navData.`
		)
	}
	// Get a fallback title by searching all navNodes for title text that,
	// in slug form, matches the last path part. At worst, path will be used.
	// Note: this is for a really edgy case related to misuse of { title, href }
	// nodes for internal links. It may not come up in practice.
	const fallbackTitle = getFallbackTitle(pathString, navNodes)
	return { title: fallbackTitle }
}

function findAllPathMatchedNodes(navNodes, pathString, depth = 0) {
	return navNodes
		.slice()
		.map((node) => findPathMatchedNodes(node, pathString, depth))
		.reduce((matches, acc) => acc.concat(matches), [])
}

function findPathMatchedNodes(navNode, pathString, depth) {
	// If it's a node with child routes, look for matches
	// within the child routes
	if (navNode.routes) {
		// Check for an index (aka "Overview") node in the child routes.
		// These nodes will have paths with a number of parts
		// equal to the current route depth + 1
		const indexMatches = navNode.routes.filter((r) => {
			if (!r.path) {
				return false
			}
			const pathParts = r.path.split('/')
			return pathParts.length == depth + 1
		})

		// If we have a child route which serves as an index page,
		// then return the title of this "parent" navNode, rather
		// that the title of the index page (which is usually "Overview")
		if (indexMatches.length && indexMatches[0].path == pathString) {
			return [{ title: navNode.title, path: indexMatches[0].path }]
		}
		// If we don't have a child route that serves as an index page,
		// then we have an index-less category. We check whether
		// the current path string matches the inferred path
		// to the index-less category.
		if (indexMatches.length == 0) {
			const routesWithPaths = navNode.routes.filter((r) => {
				return Boolean(r.path)
			})
			if (routesWithPaths.length) {
				// Iterate over all child nodes, match may not be in first node
				for (let i = 0; i < routesWithPaths.length; i++) {
					const inferredPathParts = routesWithPaths[i].path.split('/')
					inferredPathParts.pop()
					const inferredPath = inferredPathParts.join('/')
					if (inferredPath == pathString) {
						return [{ title: navNode.title }]
					}
				}
			}
		}
		// Otherwise, continue searching in all child routes
		return findAllPathMatchedNodes(navNode.routes, pathString, depth + 1)
	}
	// If it's a node with a path value,
	// return the node if the path is a match
	if (typeof navNode.path == 'string') {
		return navNode.path === pathString ? [{ ...navNode }] : []
	}
	// Otherwise, it's a divider or a direct link,
	// so return an empty array (no match)
	return []
}

interface GetDocsBreadcrumbsOpts extends GetPathBreadcrumbsOpts {
	baseName: string
	product: Pick<ProductData, 'slug' | 'name' | 'rootDocsPaths'>
	versions?: VersionSelectItem[]
	indexOfVersionPathPart?: number
}

function getDocsBreadcrumbs({
	baseName,
	basePath,
	indexOfVersionPathPart,
	navData,
	pathParts,
	version,
	product,
}: GetDocsBreadcrumbsOpts): BreadcrumbLink[] {
	/**
	 * Set up breadcrumbs for the main home page and product home page.
	 */
	const breadcrumbs: BreadcrumbLink[] = [
		{ title: 'Developer', url: '/' },
		{ title: product.name, url: `/${product.slug}` },
	]

	/**
	 * If we're in a "nested" rootDocsPath, add a breadcrumb for the parent.
	 *
	 *  For context, most rootDocsPaths represent a single breadcrumb item.
	 * Others have multiple path parts, and therefore may represent
	 * multiple breadcrumb items.
	 *
	 * For example, Terraform's rootDocsPath `plugin` is a single item.
	 * But Terraform's rootDocsPath `plugin/sdkv2` represents two items:
	 * - The `plugin` rootDocsPath
	 * - The nested `plugin/sdkv2` rootDocsPath.
	 */
	const parentRootDocsPath = getParentRootDocsPath(
		basePath,
		product.rootDocsPaths
	)
	if (parentRootDocsPath !== null) {
		const url = `/${product.slug}/${parentRootDocsPath.path}`
		breadcrumbs.push({ title: parentRootDocsPath.name, url })
	}

	/**
	 * Generate the root docs path item's url
	 */
	// Determine the breadcrumb title, which should include the version if present
	let rootDocsPathTitle
	let filteredPathParts
	if (indexOfVersionPathPart >= 0) {
		rootDocsPathTitle = `${baseName} ${version}`
		filteredPathParts = pathParts.filter(
			(_, index) => index !== indexOfVersionPathPart
		)
	} else {
		rootDocsPathTitle = baseName
		filteredPathParts = pathParts
	}
	// Determine the breadcrumb URL, which should include the version if present
	let rootDocsPathUrl
	if (version) {
		rootDocsPathUrl = `/${product.slug}/${basePath}/${version}`
	} else {
		rootDocsPathUrl = `/${product.slug}/${basePath}`
	}
	breadcrumbs.push({
		title: rootDocsPathTitle,
		url: rootDocsPathUrl,
		isCurrentPage: pathParts.length == 0,
	})

	/**
	 * Add breadcrumbs for all path parts past the rootDocsPath.
	 * The titles for these, which are intended to match the title
	 * of the corresponding docs pages, will be derived sidebar nav items.
	 */
	const pathBreadcrumbs = getPathBreadcrumbs({
		basePath: `${product.slug}/${basePath}`,
		navData,
		pathParts: filteredPathParts,
		version,
	})
	breadcrumbs.push(...pathBreadcrumbs)

	/**
	 * Return all breadcrumbs
	 */
	return breadcrumbs
}

export { getPathBreadcrumbs }
export default getDocsBreadcrumbs
