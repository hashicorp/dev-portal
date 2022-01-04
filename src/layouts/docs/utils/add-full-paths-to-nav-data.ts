// TODO: replace $TSFixMe here with the navNode type
// TODO: (import from react-docs-sidenav?)

function addFullPathsToNavData(
  nodes: $TSFixMe[],
  basePaths: string[]
): $TSFixMe[] {
  return nodes.map((n) => addFullPathToNavNode(n, basePaths))
}

function addFullPathToNavNode(node: $TSFixMe, basePaths: string[]): $TSFixMe {
  if (node.routes) {
    // For nodes with routes, add fullPaths to all routes
    return { ...node, routes: addFullPathsToNavData(node.routes, basePaths) }
  } else if (node.path) {
    // For nodes with paths, add fullPath to the node
    return { ...node, fullPath: `/${basePaths.join('/')}/${node.path}` }
  } else {
    // Otherwise return the node unmodified
    return node
  }
}

export default addFullPathsToNavData
