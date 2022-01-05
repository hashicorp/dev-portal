import slugify from 'slugify'
import { NavNode } from '@hashicorp/react-docs-sidenav/types'
import { MenuItem } from 'components/sidebar'

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

function prepareNavDataForClient(
  nodes: NavNode[],
  basePaths: string[]
): MenuItem[] {
  return nodes.map((n) => prepareNavNodeForClient(n, basePaths))
}

function prepareNavNodeForClient(node: NavNode, basePaths: string[]): MenuItem {
  if (isNavBranch(node)) {
    // For nodes with routes, add fullPaths to all routes, and `id`
    return {
      ...node,
      routes: prepareNavDataForClient(node.routes, basePaths),
      id: slugify(`submenu-${node.title}`, { lower: true }),
    }
  } else if (isNavLeaf(node)) {
    // For nodes with paths, add fullPath to the node, and `id`
    return {
      ...node,
      fullPath: `/${basePaths.join('/')}/${node.path}`,
      id: slugify(`menu-item-${node.path}`, { lower: true }),
    }
  } else if (isNavDirectLink(node)) {
    // For direct link nodes, add `id` only
    return {
      ...node,
      id: slugify(`external-url-${node.title}`, { lower: true }),
    }
  } else {
    // Otherwise return the node unmodified
    return node
  }
}

export default prepareNavDataForClient
