import { BreadcrumbLink } from '..'

/**
 * These type definitions are from docs-sidenav.
 * TODO: reconcile these type definitions with sidebar MenuItem type
 */

type NavData = NavNode[]

type NavNode =
  | NavLeaf
  | NavUnlinkedLeaf
  | NavDirectLink
  | NavDivider
  | NavHeading
  | NavBranch
interface NavUnlinkedLeaf {
  title: string
}

// A NavLeaf represents a page with content.
//
// The "path" refers to the URL route from the content subpath.
// For all current docs sites, this "path" also
// corresponds to the content location in the filesystem.
//
// Note that "path" can refer to either "named" or "index" files.
// For example, we will automatically resolve the path
// "commands" to either "commands.mdx" or "commands/index.mdx".
// If both exist, we will throw an error to alert authors
// to the ambiguity.
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

// A NavDivider represents a divider line
interface NavDivider {
  divider: true
}

interface NavHeading {
  heading: string
}

// A NavBranch represents nested navigation data.
interface NavBranch {
  title: string
  routes: NavNode[]
}

// ...

const IS_DEV = process.env.NODE_ENV !== 'production'

interface GetPathBreadcrumbsOpts {
  /** The base path for the current route, if applicable. For example, "docs". Returned breadcrumb links will be prefixed with this path. */
  basePath: string
  /** An array of nav nodes, as defined by our sidenav component. */
  navData: NavData
  /** An array of parameters representing the path from the basePath to the current path.  */
  pathParts: string[]
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
  const breadcrumbNodes = breadcrumbPaths.map((p) =>
    getPathMatchedNode(navData, p, basePath)
  )
  // Map the matched navData nodes into { title, url }
  // objects as needed for breadcrumb link rendering.
  return breadcrumbNodes.map((navNode) => {
    const link = { title: navNode.title } as BreadcrumbLink
    if (isNavLeaf(navNode)) {
      if (navNode.path) {
        link.url = `/${basePath}/${navNode.path}`
      }
      if (navNode.path == pathParts.join('/')) {
        link.isCurrentPage = true
      }
    }
    return link
  })
}

function getPathMatchedNode(
  navNodes: NavData,
  pathString: string,
  basePath: string
): NavLeaf | NavUnlinkedLeaf {
  const matches = findAllPathMatchedNodes(navNodes, pathString)
  // If we have exactly one match, this is great, and expected
  if (matches.length == 1 && isNavLeaf(matches[0])) {
    return matches[0]
  }
  // If we do not have exactly one match, we likely
  // have a problem with the navData that was not caught
  // by our docs-sidenav validation functions, and we should address it.
  // ..
  // If navData has ambiguous matches, warn in development.
  // We can fallback to returning the first match, and this should
  // be fine from a visitor perspective. Less urgent to fix these types of issues.
  if (matches.length > 1 && isNavLeaf(matches[0])) {
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
  // unlinked breadcrumb item using the "pathString" as the title
  if (IS_DEV) {
    console.warn(
      `Missing breadcrumb path under "${basePath}": Found zero matches for "${pathString}". Please ensure there is a node (or index-less category) with the path "${pathString}" in the provided navData.`
    )
  }
  const lastPathPart = pathString.split('/').pop()
  return { title: lastPathPart }
}

function findAllPathMatchedNodes(
  navNodes: NavData,
  pathString: string,
  // eslint-disable-next-line @typescript-eslint/typedef
  depth = 0
): NavNode[] {
  return navNodes
    .slice()
    .map((node: NavNode) => findPathMatchedNodes(node, pathString, depth))
    .reduce((matches: NavNode[], acc: NavNode[]) => acc.concat(matches), [])
}

function isNavBranch(navNode: NavNode): navNode is NavBranch {
  // TODO: figure out how to do this typeguard
  // @ts-expect-error - not sure how to do this typeguard?
  return Array.isArray(navNode.routes)
}

function isNavLeaf(navNode: NavNode): navNode is NavLeaf {
  // TODO: figure out how to do this typeguard
  // @ts-expect-error - not sure how to do this typeguard?
  return typeof navNode.path === 'string'
}

function findPathMatchedNodes(
  navNode: NavNode,
  pathString: string,
  depth: number
): NavNode[] {
  // If it's a node with child routes, look for matches
  // within the child routes
  if (isNavBranch(navNode)) {
    // Check for an index (aka "Overview") node in the child routes.
    // These nodes will have paths with a number of parts
    // equal to the current route depth + 1
    const indexMatches = navNode.routes.filter((r) => {
      if (!isNavLeaf(r)) {
        return false
      }
      const pathParts = r.path.split('/')
      return pathParts.length == depth + 1
    })
    // If we have a child route which serves as an index page,
    // then return the title of this "parent" navNode, rather
    // that the title of the index page (which is usually "Overview")
    if (
      indexMatches.length &&
      isNavLeaf(indexMatches[0]) &&
      indexMatches[0].path == pathString
    ) {
      return [{ title: navNode.title, path: indexMatches[0].path }]
    }
    // If we don't have a child route that serves as an index page,
    // then we have an index-less category. We check whether
    // the current path string matches the inferred path
    // to the index-less category.
    if (indexMatches.length == 0) {
      const routesWithPaths = navNode.routes.filter((r: NavNode) => {
        return isNavLeaf(r)
      })
      if (routesWithPaths.length && isNavLeaf(routesWithPaths[0])) {
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
  if (isNavLeaf(navNode)) {
    return navNode.path === pathString ? [{ ...navNode }] : []
  }
  // Otherwise, it's a divider or a direct link,
  // so return an empty array (no match)
  return []
}

interface GetDocsBreadcrumbsOpts extends GetPathBreadcrumbsOpts {
  baseName: string
  productName: string
  productPath: string
}

function getDocsBreadcrumbs({
  basePath,
  baseName,
  navData,
  pathParts,
  productName,
  productPath,
}: GetDocsBreadcrumbsOpts): BreadcrumbLink[] {
  return [
    { title: 'Developer', url: '/' },
    { title: productName, url: `/${productPath}` },
    { title: baseName, url: `/${productPath}/${basePath}` },
    ...getPathBreadcrumbs({
      basePath: `${productPath}/${basePath}`,
      navData,
      pathParts,
    }),
  ]
}

export { getPathBreadcrumbs }
export default getDocsBreadcrumbs
