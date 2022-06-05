import slugify from 'slugify'

/**
 * Given a lastPathPart, which represents a slug-ified title,
 * and an array of NavNodes,
 * find matching title attributes that, when slug-ified,
 * match the provided lastPathPart.
 */
function findAllFallbackTitles(navNodes, lastPathPart): string[] {
  return navNodes
    .slice()
    .map((node) => findFallbackTitles(node, lastPathPart))
    .reduce((matches, acc) => acc.concat(matches), [])
}

/**
 * Given a lastPathPart, which represents a slug-ified title,
 * and a single NavNode,
 * find matching title attributes that, when slug-ified,
 * match the provided lastPathPart.
 */
function findFallbackTitles(navNode, lastPathPart): string[] {
  const matches = []
  // If this nav node has a title, try to match it directly
  if (typeof navNode.title == 'string') {
    const titleSlug = slugify(navNode.title, { lower: true })
    if (titleSlug == lastPathPart) {
      matches.push(navNode.title)
    }
  }
  // If it's a node with child routes, look for matches within
  if (navNode.routes) {
    const nestedMatches = findAllFallbackTitles(navNode.routes, lastPathPart)
    matches.push(...nestedMatches)
  }
  // Otherwise, it's a divider or a direct link,
  // so no need to look for additional matches
  return matches
}

export default findAllFallbackTitles
