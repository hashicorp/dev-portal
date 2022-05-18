import { ProductSlug } from 'types/products'
import { Version } from './fetch-release-data'

/**
 * Determines whether or not `window.analytics.track` can be invokved.
 */
const canTrackAnalytics = (): boolean => {
  return (
    typeof window !== undefined &&
    window.analytics &&
    window.analytics.track &&
    typeof window.analytics.track === 'function'
  )
}

/**
 * Invokes `window.analytics.track` if it is able to be invokved.
 */
const safeAnalyticsTrack = (
  eventName: string,
  properties: Record<string, unknown>
): void => {
  if (canTrackAnalytics()) {
    window.analytics.track(eventName, properties)
  }
}

/**
 * Handles tracking the Download event in the same format it was tracked
 * previously on .io sites (excluding the `category` and `label` properties).
 *
 * Important notes:
 *  - Properties are defined in `analytics/spec/events/product_downloaded.yaml`
 *  - `prettyOSName` examples: "macOS", "Windows", "Linux", "FreeBSD", "NetBSD",
 *    "OpenBSD", "Solaris"
 *  - `architecture` will have it's first character capitalized automatically
 *
 * Based off `@hashicorp/react-product-downloads-page`'s `trackDownload`:
 * https://github.com/hashicorp/react-components/blob/d6eba7971bbbf7c58cf3cc110f5b7b423e3cd27c/packages/product-download-page/utils/downloader.ts#L115-L134
 */
const trackProductDownload = ({
  architecture,
  prettyOSName,
  productSlug,
  version,
}: {
  architecture: string
  prettyOSName: string
  productSlug: Exclude<ProductSlug, 'hcp'>
  version: Version
}) => {
  // Ensure the `architecture` property has the correct casing
  const lowercasedArchitectureName = architecture.toLowerCase()
  const casedArchitectureName =
    lowercasedArchitectureName.charAt(0).toUpperCase() +
    lowercasedArchitectureName.slice(1)

  // Track the Download event
  safeAnalyticsTrack('Download', {
    architecture: casedArchitectureName,
    operating_system: prettyOSName,
    product: productSlug,
    version,
  })
}

export { safeAnalyticsTrack, trackProductDownload }
