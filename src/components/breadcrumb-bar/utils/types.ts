/**
 * These type definitions are from docs-sidenav.
 * TODO: reconcile these type definitions with sidebar MenuItem type
 */

export type NavData = NavNode[]

export type NavNode =
  | NavLeaf
  | NavUnlinkedLeaf
  | NavDirectLink
  | NavDivider
  | NavHeading
  | NavBranch

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
export interface NavLeaf {
  title: string
  path: string
}

// A NavUnlinkedLeaf represents a NavBranch without an index page.
//
// These may occur in breadcrumbBar due to "index" / "overview" pages
// not being a strict requirement.
export interface NavUnlinkedLeaf {
  title: string
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

export function isNavBranch(navNode: NavNode): navNode is NavBranch {
  // TODO: figure out how to do this typeguard
  // @ts-expect-error - not sure how to do this typeguard?
  return Array.isArray(navNode.routes)
}

export function isNavLeaf(navNode: NavNode): navNode is NavLeaf {
  // TODO: figure out how to do this typeguard
  // @ts-expect-error - not sure how to do this typeguard?
  return typeof navNode.path === 'string'
}
