import { Pluggable } from 'unified'
import remarkPluginAdjustLinkUrls from 'lib/remark-plugin-adjust-link-urls'
import isAbsoluteUrl from 'lib/is-absolute-url'

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
 * TODO: the /sentinel/changelog page still needs to be built and included!
 * `/changelog` - does not need to change
 * All other internal URLs - assumed to be docs URLs,
 * so should be prefixed with `/docs`.
 */
function prefixSentinelDocsUrls(inputUrl: string): string {
  // We only want to adjust internal URLs, so we return absolute URLs as-is
  if (isAbsoluteUrl(inputUrl)) return inputUrl
  // We now know we're dealing with internal URLs only
  let outputUrl = inputUrl.slice()
  // First, we have to remove the `/sentinel` prefix from all URLs that have it,
  // as we re-add the product prefix in "components/docs-anchor"
  const hasSentinelPrefix = outputUrl.startsWith('/sentinel')
  if (hasSentinelPrefix) outputUrl = outputUrl.replace('/sentinel', '')
  // Next, we check if the URL points to a non-docs known page:
  // /intro, /downloads, or /changelog.
  // If it does note, then the URL is assumed to be a /docs URL.
  // To make it work, we need to prefix it with /docs.
  const isIntroUrl = outputUrl == '/intro' || outputUrl.startsWith('/intro/')
  const isDownloadsUrl = outputUrl == '/downloads'
  const isChangelogUrl = outputUrl == '/changelog'
  const isDocsUrl = !isIntroUrl && !isDownloadsUrl && !isChangelogUrl
  if (isDocsUrl) outputUrl = `/docs${outputUrl}`
  return outputUrl
}

function rewriteApiToApiDocs(inputUrl: string): string {
  let outputUrl = inputUrl.slice()
  const isBadApiUrl = outputUrl == '/api' || outputUrl.startsWith('/api/')
  if (isBadApiUrl) outputUrl = outputUrl.replace(/^\/api/, '/api-docs')
  return outputUrl
}
