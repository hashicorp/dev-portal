import { NavNode } from '@hashicorp/react-docs-sidenav/types'

import { DEFAULT_PARAM_ID } from './consts'

export function getPathArraysFromNodes(navNodes: NavNode[]): string[][] {
  const slugs: string[][] = navNodes.reduce((acc, navNode) => {
    // Individual items have a path, these should be added
    if ('path' in navNode) return acc.concat([navNode.path.split('/')])
    // Category items have child routes, these should all be added
    if ('routes' in navNode)
      return acc.concat(getPathArraysFromNodes(navNode.routes))
    // All other node types (dividers, external links) can be ignored
    return acc
  }, [])
  return slugs
}

export function getPathsFromNavData(
  navDataResolved: NavNode[],
  paramId: string = DEFAULT_PARAM_ID
): {
  params: Record<string, string[]>
}[] {
  //  Transform navigation data into path arrays
  const pagePathArrays = getPathArraysFromNodes(navDataResolved)
  // Ensure we include an empty array for the "/" index page path
  // (may be included in nav-data, eg for Terraform, or may not, eg for all other sites)
  const hasIndexPage = pagePathArrays.filter((p) => p == []).length > 0
  if (!hasIndexPage) pagePathArrays.unshift([])
  // Return the array of all page paths
  const paths = pagePathArrays.map((p) => ({ params: { [paramId]: p } }))
  return paths
}
