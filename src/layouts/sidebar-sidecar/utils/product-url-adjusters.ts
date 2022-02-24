import { Pluggable } from 'unified'
import remarkPluginAdjustLinkUrls from 'lib/remark-plugin-adjust-link-urls'

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

function rewriteApiToApiDocs(inputUrl: string): string {
  let outputUrl = inputUrl.slice()
  const isBadApiUrl = outputUrl == '/api' || outputUrl.startsWith('/api/')
  if (isBadApiUrl) outputUrl = outputUrl.replace(/^\/api/, '/api-docs')
  return outputUrl
}
