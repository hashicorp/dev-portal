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
    // TODO: Previous implementation assumed  all direct link nodes
    // TODO: would be absolute, external URLs.
    // TODO: This assumption is not correct, I think... we have some
    // TODO: direct link nodes which use absolute URLs, eg `/api-docs`
    // TODO: or `/commands`. These need to be adjusted, as such URLs would
    // TODO: assume {product}.io/{href}, while here in dev-portal, our URL
    // TODO: structure needs to be dev.hashicorp.com/{productSlug}/{href}.
    // TODO:
    // TODO: productSlug is already available in this context as basePaths[0].
    // TODO:
    // TODO: For example, if basePaths[0] is "consul", `/api-docs` should
    // TODO: become `/consul/api-docs`, `/commands` should become
    // TODO: `/consul/commands`, and so on.
    // TODO:
    // TODO: First cut at fixing this below, with adjustedHref...
    // For direct links, if they're absolute URLs,
    // such as https://www.example.com, then leave them untouched.
    // Otherwise, prefix them with the product slug (basePath[0])
    const adjustedHref = isAbsoluteUrl(node.href)
      ? node.href
      : `/${basePaths[0]}${node.href}`
    // Also add `id` for direct links
    return {
      ...node,
      href: adjustedHref,
      id: slugify(`external-url-${node.title}`, { lower: true }),
    }
  } else {
    // Otherwise return the node unmodified
    return node
  }
}

export default prepareNavDataForClient
