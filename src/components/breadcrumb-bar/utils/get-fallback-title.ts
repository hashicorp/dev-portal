import slugify from 'slugify'

/**
 * Given a path string and a set of navNodes,
 * find "title" text on any of the nodes that
 * matches the pathString in question when slugified.
 *
 * In certain cases, this "title" text is useful as a fallback
 * when there is not navNode explicitly associated with the pathString
 * (such as for category nodes that do not have an index page,
 * and contain only a single leaf node such that the category's
 * index route cannot be inferred).
 */
function getFallbackTitle(pathString, navNodes) {
  const lastPathPart = pathString.split('/').pop()
  const fallbackTitleMatches = findAllFallbackTitleMatches(
    navNodes,
    lastPathPart
  )
  // In the case that no title matches the last path part,
  // then we render the snake-cased last path part (as a very last resort).
  const fallbackTitle = fallbackTitleMatches.length
    ? fallbackTitleMatches[0]
    : lastPathPart
  return fallbackTitle
}

/**
 * Given a lastPathPart, which represents a slug-ified title,
 * and an array of NavNodes,
 * find matching title attributes that, when slug-ified,
 * match the provided lastPathPart.
 */
function findAllFallbackTitleMatches(navNodes, lastPathPart): string[] {
  return navNodes
    .slice()
    .map((node) => findFallbackTitleMatches(node, lastPathPart))
    .reduce((matches, acc) => acc.concat(matches), [])
}

/**
 * Given a lastPathPart, which represents a slug-ified title,
 * and a single NavNode,
 * find matching title attributes that, when slug-ified,
 * match the provided lastPathPart.
 */
function findFallbackTitleMatches(navNode, lastPathPart): string[] {
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
    const nestedMatches = findAllFallbackTitleMatches(
      navNode.routes,
      lastPathPart
    )
    matches.push(...nestedMatches)
  }
  // Otherwise, it's a divider or a direct link,
  // so no need to look for additional matches
  return matches
}

export default getFallbackTitle
