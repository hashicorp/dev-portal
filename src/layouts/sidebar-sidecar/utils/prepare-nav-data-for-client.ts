import slugify from 'slugify'
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

function prepareNavDataForClient({
  basePaths,
  nodes,
}: {
  basePaths: string[]
  nodes: NavNode[]
}): MenuItem[] {
  return nodes
    .map((node) => prepareNavNodeForClient({ basePaths, node }))
    .filter((node) => node)
}

function prepareNavNodeForClient({
  basePaths,
  node,
}: {
  node: NavNode
  basePaths: string[]
}): MenuItem {
  /**
   * TODO: we need aligned types that will work here. NavNode (external import)
   * does not allow the `hidden` property.
   *
   * ref: https://app.asana.com/0/1201010428539925/1201602267333015/f
   */
  if ((node as any).hidden) {
    return null
  }

  if (isNavBranch(node)) {
    // For nodes with routes, add fullPaths to all routes, and `id`
    return {
      ...node,
      routes: prepareNavDataForClient({ basePaths, nodes: node.routes }),
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
    const id = slugify(`external-url-${node.title}`, { lower: true })
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
      return {
        ...node,
        fullPath: `/${basePaths[0]}${node.href}`,
        href: null,
        id,
        path: node.href,
      }
    } else {
      // Otherwise, this is a genuinely external NavDirectLink,
      // so we only need to add an `id` to it.
      return { ...node, id }
    }
  } else {
    // Otherwise return the node unmodified
    return node
  }
}

export default prepareNavDataForClient
