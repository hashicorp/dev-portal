import { Pluggable } from 'unified'
import remarkPluginAdjustLinkUrls from 'lib/remark-plugin-adjust-link-urls'
import isAbsoluteUrl from 'lib/is-absolute-url'
import sentinelData from 'data/sentinel.json'

/**
 * We must fix /api URLs, which should really be /api-docs. This would ideally
 * be done in the source MDX. However, we need to support all past versions, so
 * even if we corrected the latest source, we'd likely still want to run this on
 * older content.
 *
 * Returns the modified URL.
 *
 * Note that further modification happens client-side, via our DocsAnchor custom
 * MDX component.
 */
export const vaultUrlAdjuster: Pluggable = [
  remarkPluginAdjustLinkUrls,
  { urlAdjustFn: rewriteApiToApiDocs },
]
export const consulUrlAdjuster: Pluggable = [
  remarkPluginAdjustLinkUrls,
  { urlAdjustFn: rewriteApiToApiDocs },
]
export const sentinelUrlAdjuster: Pluggable = [
  remarkPluginAdjustLinkUrls,
  { urlAdjustFn: prefixSentinelDocsUrls },
]

/**
 * Outside of dev-dot, the Sentinel docs, for which MDX content was written,
 * were located at https://docs.hashicorp.com/sentinel.
 * `/sentinel/docs` was located at the `/sentinel` and
 * `/sentinel/intro` was located at `/sentinel/intro`.
 *
 * So, we need to adjust Sentinel docs internal URLs for use in dev-dot.
 * (Note that we prefix URLs with the product slug on the client side,
 * in "components/docs-anchor", so for the final URL /sentinel/docs/commands,
 * we need to have the URL /docs/commands in MDX content;
 * similarly for the final URL /sentinel/downloads, we need to have /downloads).
 *
 * With the above in mind,
 * all URLs must be prefixed with `/docs`, with the exception of:
 * `/intro/*` - does not need to change
 * `/downloads` - does not need to change
 * `/changelog` - does not need to change
 * All other internal URLs - assumed to be docs URLs,
 * so should be prefixed with `/docs`.
 */
function prefixSentinelDocsUrls(inputUrl: string): string {
  // We only want to adjust internal URLs, so we return absolute URLs as-is
  if (isAbsoluteUrl(inputUrl)) return inputUrl

  // We now know we're dealing with internal URLs only
  let outputUrl = inputUrl.slice()

  /**
   * We gather some information on what link routes we're dealing with. Note
   * that on the client-side, "components/docs-anchor" will modify URLs that
   * start with any of the "basePath" strings defined in the "basePaths" array
   * in "data/{product.json". Any such URLs will be prefixed with the product
   * name, in this case "sentinel". However, unlike other product sites, links
   * in the Sentinel docs already contain this prefix. So, we need to remove the
   * prefix from any URLs that will later be modified based on "basePaths",
   * while retaining it for URLs that will not match "basePaths" (namely
   * "downloads" and "changelog").
   *
   * TODO: could this be simplified by doing all URL manipulations here at
   * server time, rather than also prefixing some URLs on the client-side using
   * "components/docs-anchor"? (May be useful longer term as well, eg if authors
   * become accustomed to the new URL structure on dev-dot, and want to write
   * with those URLs in mind, rather than the old dot-io URL structures, then we
   * could apply these remark transformations to all content and remove the need
   * for prefixing and manipulating.)
   * Asana: https://app.asana.com/0/1201010428539925/1201921061548315/f
   */
  const isBasePathExceptDocs = sentinelData.basePaths.reduce(
    (wasMatched, basePath) => {
      const isMatch =
        outputUrl == `/sentinel/${basePath}` ||
        outputUrl.startsWith(`/sentinel/${basePath}/`)
      return wasMatched || isMatch
    },
    false
  )

  /**
   * Note that "docs" links will not be caught by the above check, as on the
   * sentinel site they are found under `/sentinel/*`, rather than under
   * `/sentinel/docs` as defined by our basePaths here in dev-dot. So, we assume
   * that if an internal link prefixed with `/sentinel` it NOT one of the other
   * two known links (downloads and changelog), then it must be a docs link.
   */
  const isDownloadsUrl = outputUrl == '/sentinel/downloads'
  const isChangelogUrl = outputUrl == '/sentinel/changelog'
  const isDocsUrl = !isBasePathExceptDocs && !isDownloadsUrl && !isChangelogUrl

  // Now we have all the info we need, so we remove prefixes from
  // all our "basePath" URLs - including the assumed "docs" links.
  const hasSentinelPrefix = outputUrl.startsWith('/sentinel')
  const willBePrefixedOnClient = isBasePathExceptDocs || isDocsUrl
  const shouldRemovePrefix = hasSentinelPrefix && willBePrefixedOnClient
  if (shouldRemovePrefix) outputUrl = outputUrl.replace('/sentinel', '')

  // Finally, we also need to prefix "docs" URLs with "/docs" in order
  // to match the route structure we have here in dev-dot
  if (isDocsUrl) outputUrl = `/docs${outputUrl}`
  return outputUrl
}

function rewriteApiToApiDocs(inputUrl: string): string {
  let outputUrl = inputUrl.slice()
  const isBadApiUrl = outputUrl == '/api' || outputUrl.startsWith('/api/')
  if (isBadApiUrl) outputUrl = outputUrl.replace(/^\/api/, '/api-docs')
  return outputUrl
}
