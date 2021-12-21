function addIsActiveToNodes(navNodes, currentPath, pathname) {
  return navNodes
    .slice()
    .map((node) => addIsActiveToNode(node, currentPath, pathname))
}

function addIsActiveToNode(navNode, currentPath, pathname) {
  // If it's a node with child routes, return true
  // if any of the child routes are active
  if (navNode.routes) {
    const routesWithActive = addIsActiveToNodes(
      navNode.routes,
      currentPath,
      pathname
    )
    const isActive =
      routesWithActive.filter((r) => {
        // Note: we set categories to be "active" only if they have an
        // internal, "canonical" ({ title, path }) active descendent.
        //
        // We do not highlight categories that have "direct link"
        // ({title, href }) descendants. This covers the following use cases:
        //
        // 1. Typical use case - { title, path } internal links
        //    The category contains the "canonical" { title, path } link,
        //    ancestor categories will be expanded and highlighted.
        //    We've validated there are no duplicate { title, path } links
        //    using the "validate-route-structure" utility.
        // 2. "Alias" use case - { title, href } internal links
        //    Categories with active "alias" link descendants will
        //    not be expanded or highlighted. This is an intentional stopgap
        //    measure to account for the "alias" use case. For details, see:
        //    https://app.asana.com/0/1100423001970639/1200311175037672/f
        //
        // Note that categories containing external direct links will not
        // be highlighted. By definition, external direct links will be outside
        // of the base route where the docs-sidenav is rendered, so we don't
        // seem to have a need to highlight these as active.
        const isActiveCanonical = r.__isActive && r.path
        const isActiveCategory = r.__isActive && r.routes
        return isActiveCanonical || isActiveCategory
      }).length > 0
    return { ...navNode, routes: routesWithActive, __isActive: isActive }
  }
  // If it's a node with a path value,
  // return true if the path is a match
  if (typeof navNode.path == 'string') {
    const isActive = navNode.path === currentPath
    return { ...navNode, __isActive: isActive }
  }
  // If it's a direct link,
  // return true if the path matches the router.pathname
  if (navNode.href) {
    const isActive = navNode.href === pathname
    return { ...navNode, __isActive: isActive }
  }
  // Otherwise, it's a divider, so return unmodified
  return navNode
}

export default addIsActiveToNodes
