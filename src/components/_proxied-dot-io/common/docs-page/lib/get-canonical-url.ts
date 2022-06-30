import { HOSTNAME_MAP } from 'constants/hostname-map'

function getDomainFromProductSlug(productSlug: string) {
  // the end result here is a single object entry: [['www.waypointproject.io', 'waypoint']]
  const [productDomain] = Object.entries(HOSTNAME_MAP)
    // get all matching entries for the product
    .filter(([, product]) => product === productSlug)
    // ignore test domains
    .filter(([hostname]) => !hostname.includes('hashi-mktg.com'))

  // grab the domain, which is the first item of the matching entry: ['www.waypointproject.io', 'waypoint']
  return productDomain?.[0]
}

/**
 * Generate a canonical URL for an arbitrary product docs page
 *
 * Example:
 * ```ts
 * getCanonicalUrlForDocsPage({ baseRoute: 'docs', currentPath: 'upgrade/compatibility', productSlug: 'waypoint' })
 * // returns https://www.waypointproject.io/docs/upgrade/compatibility
 * ```
 */
export function getCanonicalUrlForDocsPage({
  baseRoute,
  currentPath,
  productSlug,
}: {
  baseRoute: string
  currentPath: string
  productSlug: string
}) {
  const productDomain = getDomainFromProductSlug(productSlug)

  // ensure we don't serve an incorrect canonical URL
  if (!productDomain) {
    return
  }

  const canonicalUrl = new URL(
    [baseRoute, currentPath].filter(Boolean).join('/'),
    // stub in a domain, we will replace it below
    'https://hashicorp.com'
  )

  canonicalUrl.hostname = productDomain

  return canonicalUrl.toString()
}
