import { NavData } from '@hashicorp/react-docs-sidenav'
import { BreadcrumbLink } from '..'

/**
 * Given a basePath, navData, and array of path parameters,
 * Return an array of breadcrumb links leading to this page.
 *
 * Note that the returned array does not include links beyond
 * the basePath. So, in many use cases, consumers will likely
 * want to prefix this array to provide a more complete
 * list of breadcrumb links.
 */
function getDocsBreadcrumbs({
  basePath,
  navData,
  pathParts,
}: {
  /** The base path for the current route, if applicable. For example, "docs". Returned breadcrumb links will be prefixed with this path. */
  basePath: string
  /** An array of nav nodes, as defined by our sidenav component. */
  navData: NavData
  /** An array of parameters representing the path from the basePath to the current path.  */
  pathParts: string[]
}): BreadcrumbLink[] {
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
  const breadcrumbNodes = breadcrumbPaths.map((p) =>
    getPathMatchedNode(navData, p)
  )
  // Map the matched navData nodes into { title, url }
  // objects as needed for breadcrumb link rendering.
  return breadcrumbNodes.map(({ title, path }) => {
    const link = { title } as BreadcrumbLink
    if (path) link.url = `/${basePath}/${path}`
    if (path == pathParts.join('/')) link.isCurrentPage = true
    return link
  })
}

function findPathMatchedNodes(navNode, pathString, depth) {
  // If it's a node with child routes, return true
  // if any of the child routes are active
  if (navNode.routes) {
    // Check for an index (aka "Overview") node in the child routes.
    // These nodes will have paths with a number of parts
    // equal to the current route depth + 1
    const indexMatches = navNode.routes.filter((r) => {
      if (!r.path) return false
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
        const inferredPathParts = routesWithPaths[0].path.split('/')
        inferredPathParts.pop()
        const inferredPath = inferredPathParts.join('/')
        if (inferredPath == pathString) {
          return [{ title: navNode.title }]
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

function findAllPathMatchedNodes(navNodes, pathString, depth = 0) {
  return navNodes
    .slice()
    .map((node) => findPathMatchedNodes(node, pathString, depth))
    .reduce((matches, acc) => acc.concat(matches), [])
}

function getPathMatchedNode(navNodes, pathString) {
  const matches = findAllPathMatchedNodes(navNodes, pathString)
  // If we have exactly one match, this is great, and expected
  if (matches.length == 1) return matches[0]
  // If we do not have exactly one match, we likely
  // have a problem with the navData that was not caught
  // by our docs-sidenav validation functions, and we should address it.
  // ...
  // If we have zero matches, we can't recover from this,
  // so we should throw an error and break the build.
  if (matches.length == 0) {
    throw new Error(
      `Missing breadcrumb path: Found zero matches for "${pathString}". Please ensure there is a node (or index-less category) with the path "${pathString}" in the provided navData.`
    )
  }
  // If we find more than one node matched for a path,
  // we can return the first match to still be
  // able to render the breadcrumb bar.
  // We take this fallback approach in production contexts,
  // but throw an error in other envs to flag the navData issue.
  if (process.env.HASHI_ENV === 'production') {
    return matches[0]
  } else {
    throw new Error(
      `Ambiguous breadcrumb path: Found ${matches.length} matches for "${pathString}". Please ensure there is exactly one node or index-less category with the path "${pathString}" in the provided navData.`
    )
  }
}

export default getDocsBreadcrumbs
