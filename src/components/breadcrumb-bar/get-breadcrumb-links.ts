import { BreadcrumbLink } from '.'

function getBreadcrumbLinks({
  basePath,
  navData,
  params,
}: $TSFixMe): BreadcrumbLink[] {
  const allPaths = []
  for (let i = 0; i < params.length; i++) {
    allPaths.push(params.slice(0, i + 1).join('/'))
  }
  //   console.log({ allPaths })
  const breadcrumbNodes = allPaths.map((p) => getPathMatchedNode(navData, p))
  //   console.log({ breadcrumbNodes })
  return breadcrumbNodes.map(({ title, path }) => {
    return {
      title,
      url: '/' + basePath + '/' + path,
    }
  })
}

function findPathMatchedNodes(navNode, pathString) {
  // If it's a node with child routes, return true
  // if any of the child routes are active
  if (navNode.routes) {
    // Check for an "overview" node in the child routes
    // TODO: actually determine if there's an overview node
    const overviewRouteNode = false || { title: 'Overview', path: 'some/path' }
    // If we have a child route which serves as an overview page,
    // then return the title of this "parent" navNode, rather
    // that the title of the overview page (which is usually "Overview")
    if (overviewRouteNode?.path == pathString) {
      return [{ title: navNode.title, path: overviewRouteNode.path }]
    }
    // Otherwise, continue searching in all child routes
    return findAllPathMatchedNodes(navNode.routes, pathString)
  }
  // If it's a node with a path value,
  // return the node if the path is a match
  if (typeof navNode.path == 'string') {
    return navNode.path === pathString ? [{ ...navNode }] : []
  }
  // Otherwise, it's a divider or a direct link,
  // so return an empty array
  return []
}

function findAllPathMatchedNodes(navNodes, pathString) {
  return navNodes
    .slice()
    .map((node) => findPathMatchedNodes(node, pathString))
    .reduce((matches, acc) => acc.concat(matches), [])
}

function getPathMatchedNode(navNodes, pathString) {
  const matches = findAllPathMatchedNodes(navNodes, pathString)
  if (matches.length == 0) return false
  if (matches.length == 1) return matches[0]
  throw new Error(
    `Ambiguous breadcrumb: Found multiple matches for ${pathString}`
  )
}

export default getBreadcrumbLinks
