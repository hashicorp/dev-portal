import { RemarkPlugin, RemarkPluginOptions } from 'types/remark'
import adjustLinkUrlPlugin from './adjust-link-urls-plugin'

const vaultUrlAdjuster: [RemarkPlugin, RemarkPluginOptions] = [
  adjustLinkUrlPlugin,
  {
    urlAdjustFn: (sourceUrl: string): string => {
      let url = sourceUrl.slice()
      // We must fix /api URLs, which should really be /api-docs.
      // This would ideally be done in the source MDX.
      // However, we need to support all past versions,
      // so even if we corrected the latest source, we'd
      // likely still want to run this on older content.
      const isBadApiUrl = url == '/api' || url.startsWith('/api/')
      if (isBadApiUrl) url = url.replace(/^\/api/, '/api-docs')
      // Return the modified URL
      // (Note that further modification happens client-side,
      // via our DocsAnchor custom MDX component)
      return url
    },
  },
]

export { vaultUrlAdjuster }
// eslint-disable-next-line import/no-anonymous-default-export
export default { vaultUrlAdjuster }
