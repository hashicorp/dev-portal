import { NavNode } from '@hashicorp/react-docs-sidenav/types'
import { MenuItem } from 'components/sidebar'
import isAbsoluteUrl from 'lib/is-absolute-url'

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

/**
 * Prepares all sidebar nav items for client-side rendering. Keeps track of the
 * index of each node using `startingIndex` and the `traversedNodes` property
 * returned from `prepareNavNodeForClient`. Also returns its own
 * `traversedNodes` since it is recursively called in `prepareNavDataForClient`.
 */
function prepareNavDataForClient({
  basePaths,
  nodes,
  startingIndex = 0,
}: {
  basePaths: string[]
  nodes: NavNode[]
  startingIndex?: number
}): { preparedItems: MenuItem[]; traversedNodes: number } {
  const preparedNodes = []

  let count = 0
  nodes.forEach((node) => {
    const result = prepareNavNodeForClient({
      basePaths,
      node,
      nodeIndex: startingIndex + count,
    })
    if (result) {
      const { preparedItem, traversedNodes } = result
      preparedNodes.push(preparedItem)
      count += traversedNodes
    }
  })

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
function prepareNavNodeForClient({
  basePaths,
  node,
  nodeIndex,
}: {
  node: NavNode
  basePaths: string[]
  nodeIndex: number
}): { preparedItem: MenuItem; traversedNodes: number } {
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
    const { preparedItems, traversedNodes } = prepareNavDataForClient({
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
    // For nodes with paths, add fullPath to the node, and `id`
    const preparedItem = {
      ...node,
      fullPath: `/${basePaths.join('/')}/${node.path}`,
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
      // If we have a non-absolute NavDirectLink,
      // convert it to a NavLeaf node, and treat it similarly.
      // Note that the `fullPath` added here differs from typical
      // NavLeaf treatment, as we only use the first part of the `basePath`.
      // (We expect this to be the product slug, eg "consul").
      const preparedItem = {
        ...node,
        fullPath: `/${basePaths[0]}${node.href}`,
        href: null,
        id,
        path: node.href,
      }
      return { preparedItem, traversedNodes: 1 }
    } else {
      // Otherwise, this is a genuinely external NavDirectLink,
      // so we only need to add an `id` to it.
      const preparedItem = { ...node, id }
      return { preparedItem, traversedNodes: 1 }
    }
  } else {
    // Otherwise return the node unmodified
    const preparedItem = { ...node, id }
    return { preparedItem, traversedNodes: 1 }
  }
}

export default prepareNavDataForClient
