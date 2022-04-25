import path from 'path'
import { ProductSlug } from 'types/products'

/**
 *
 * This function handles rewrites for docs links in learn content
 * Refer to this whimsical for full mapping - https://whimsical.com/url-remaps-TqyEmfG6gYyiAZR1HWSWEL
 *
 * It accept a nodePath, which should be the url pathname only (e.g. just /docs, not vaultproject.io/docs)
 *
 * /docs ---> /waypoint/docs/...
 * /api --> vault/api-docs
 * /docs/some-doc.html --> /waypoint/docs/some-doc
 * /api/index.html --> waypoint/api
 */

export function handleDocsLink(nodePath: string, product: ProductSlug) {
  let finalPath = path
    .join(`/${product}`, nodePath)
    .replace(/(\/index)?.html/, '')
  const isApiDocsPath = finalPath.includes('/api/')

  if (isApiDocsPath) {
    finalPath = finalPath.replace('/api/', '/api-docs/')
  }

  return finalPath
}
