import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { BreadcrumbLink } from '..'

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

  navData: any[]

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
  // unlinked breadcrumb item using the "pathString" as the title
  if (IS_DEV) {
    console.warn(
      `Missing breadcrumb path under "${basePath}": Found zero matches for "${pathString}". Please ensure there is a node (or index-less category) with the path "${pathString}" in the provided navData.`
    )
  }
  const lastPathPart = pathString.split('/').pop()
  return { title: lastPathPart }
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

interface GetDocsBreadcrumbsOpts extends GetPathBreadcrumbsOpts {
  baseName: string
  productName: string
  productPath: string
  versions?: VersionSelectItem[]
  indexOfVersionPathPart?: number
}

function getDocsBreadcrumbs({
  baseName,
  basePath,
  indexOfVersionPathPart,
  navData,
  pathParts,
  productName,
  productPath,
  version,
}: GetDocsBreadcrumbsOpts): BreadcrumbLink[] {
  /**
   * Generate the arguments sent to `getDocsBreadcrumbs` based on whether or
   * not there is a version in the current path.
   */
  let generatedBaseName
  let filteredPathParts
  if (indexOfVersionPathPart >= 0) {
    generatedBaseName = `${baseName} ${version}`
    filteredPathParts = pathParts.filter(
      (_, index) => index !== indexOfVersionPathPart
    )
  } else {
    generatedBaseName = baseName
    filteredPathParts = pathParts
  }

  return [
    { title: 'Developer', url: '/' },
    { title: productName, url: `/${productPath}` },
    {
      title: generatedBaseName,
      url: `/${productPath}/${basePath}`,
      isCurrentPage: pathParts.length == 0,
    },
    ...getPathBreadcrumbs({
      basePath: `${productPath}/${basePath}`,
      navData,
      pathParts: filteredPathParts,
      version,
    }),
  ]
}

export { getPathBreadcrumbs }
export default getDocsBreadcrumbs
