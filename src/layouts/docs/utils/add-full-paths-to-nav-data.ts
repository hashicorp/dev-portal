import { NavNode } from '@hashicorp/react-docs-sidenav/types'
import { MenuItem } from 'components/sidebar'

// TODO: export NavBranch and NavLeaf
// TODO: types from react-docs-sidenav.
// TODO: isNavBranch & isNavLeaf might
// TODO: also make sense to include in the
// TODO: react-docs-sidenav component,
// TODO: maybe in the types.ts file as well.
interface NavBranch {
  title: string
  routes: NavNode[]
}

interface NavLeaf {
  title: string
  path: string
}

function isNavBranch(value: NavNode): value is NavBranch {
  return value.hasOwnProperty('routes')
}

function isNavLeaf(value: NavNode): value is NavLeaf {
  return value.hasOwnProperty('path')
}

function addFullPathsToNavData(
  nodes: NavNode[],
  basePaths: string[]
): MenuItem[] {
  return nodes.map((n) => addFullPathToNavNode(n, basePaths))
}

function addFullPathToNavNode(node: NavNode, basePaths: string[]): MenuItem {
  if (isNavBranch(node)) {
    // For nodes with routes, add fullPaths to all routes
    return { ...node, routes: addFullPathsToNavData(node.routes, basePaths) }
  } else if (isNavLeaf(node)) {
    // For nodes with paths, add fullPath to the node
    return { ...node, fullPath: `/${basePaths.join('/')}/${node.path}` }
  } else {
    // Otherwise return the node unmodified
    return node
  }
}

export default addFullPathsToNavData
