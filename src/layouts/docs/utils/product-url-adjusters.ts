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
  {
    urlAdjustFn: (sourceUrl: string): string => {
      let url = sourceUrl.slice()
      const isBadApiUrl = url == '/api' || url.startsWith('/api/')
      if (isBadApiUrl) url = url.replace(/^\/api/, '/api-docs')
      return url
    },
  },
]
