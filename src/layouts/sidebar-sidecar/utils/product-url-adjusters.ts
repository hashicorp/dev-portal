import isAbsoluteUrl from 'lib/is-absolute-url'
import { ProductData } from 'types/products'

/**
 * Given some product data,
 * Return a (url) => adjustedUrl function,
 * intended for use in fixing up links in docs content.
 *
 * Note that these URL adjustments are expected to be necessary for
 * every product during initial migration to HashiCorp Developer.
 *
 * If we want to remove the need for these URL adjustments, then
 * at some point in the future, we could apply these as remark transforms
 * using "remarkPluginAdjustLinkUrls" to the original source content
 * (across ALL versions!), and ask authors to use the adjusted URL format
 * going forward. Asana task:
 * https://app.asana.com/0/1202097197789424/1202569127502507/f
 */
export function getProductUrlAdjuster(
	productData: ProductData
): (url: string) => string {
	switch (productData.slug) {
		/**
		 * Sentinel is a bit of a special case,
		 * since it did not have a dedicated dot-io domain
		 */
		case 'sentinel':
			return (url: string) => rewriteSentinelDocsUrls(url, productData)
		/**
		 * Vault and Consul (and possibly others?)
		 * have authored "/api" links which used to be redirected to "/api-docs",
		 * but which we're now preferring to handle by rewriting here.
		 */
		case 'vault':
		case 'consul':
			return (url: string) => {
				const withApiDocsFix = rewriteApiToApiDocs(url)
				const withProductPrefix = rewriteDocsUrl(withApiDocsFix, productData)
				return withProductPrefix
			}
		/**
		 * All other products need their docs routes prefixed, as within docs
		 * content, authors write links as if URLs are on the dot-io sites.
		 * For example, in Waypoint content, authors write URLs like
		 * "/docs/some-waypoint-page", which need to be adjusted to be
		 * "/waypoint/docs/some-waypoint-page".
		 */
		default:
			return (url: string) => rewriteDocsUrl(url, productData)
	}
}

/**
 * NOTE on rewriteDocsUrls:
 * Authors write content as if it only exists for their product.
 * For example, Waypoint content contains links that start with "/docs",
 * but we need to be adjust these links to start with "/waypoint/docs".
 *
 * NOTE on /api to /api-docs:
 * We must fix /api URLs, which should really be /api-docs. This would ideally
 * be done in the source MDX. However, we need to support all past versions, so
 * even if we corrected the latest source, we'd likely still want to run this on
 * older content.
 */

/**
 *
 *
 * GENERIC URL REWRITE FUNCTIONS
 *
 *
 */

/**
 * Given an inputUrl, which may start with /api/,
 * Return a modified URL, which replaces any /api/ links
 * with /api-docs/ links (for compatibility with NextJS).
 */
function rewriteApiToApiDocs(inputUrl: string): string {
	const isBadApiUrl = inputUrl == '/api' || inputUrl.startsWith('/api/')
	if (isBadApiUrl) {
		return inputUrl.replace(/^\/api/, '/api-docs')
	}
	return inputUrl
}

/**
 * Given an inputUrl, and some product data,
 * assume the inputUrl has been written by docs authors in the context
 * of the specified product.
 *
 * If the inputUrl matches one of the product's basePaths,
 * Return the input URL prefixed with the product's slug.
 *
 * Otherwise, return the original inputUrl.
 *
 * For context:
 * Authors write content as if it only exists for their product.
 * 	 For example, Waypoint content contains links that start with "/docs",
 * but we need to be adjust these links to start with "/waypoint/docs".
 */
function rewriteDocsUrl(inputUrl: string, currentProduct: ProductData): string {
	// We only want to adjust internal URLs, so we return absolute URLs as-is
	if (isAbsoluteUrl(inputUrl)) {
		return inputUrl
	}

	// Prefix docs URLs. "/docs/some-path" becomes "/waypoint/docs/some-path"
	const isCurrentProductDocsUrl = currentProduct.basePaths.some(
		(basePath: string) => inputUrl.startsWith(`/${basePath}`)
	)
	if (isCurrentProductDocsUrl) {
		return `/${currentProduct.slug}${inputUrl}`
	}

	// If we didn't match the currentProduct's basePath, return the original URL.
	return inputUrl
}

/**
 *
 *
 * PRODUCT-SPECIFIC REWRITE FUNCTIONS
 *
 *
 */

/**
 * Rewrite URLs in Sentinel docs content
 */
function rewriteSentinelDocsUrls(
	inputUrl: string,
	sentinelData: ProductData
): string {
	// We only want to adjust internal URLs, so we return absolute URLs as-is
	if (isAbsoluteUrl(inputUrl)) {
		return inputUrl
	}

	/**
	 * Note: sentinel content is a bit of a special case.
	 *
	 * On the old dot-io-equivalent Sentinel deploy, at docs.hashicorp.com:
	 * - "/docs" were rendered at "/sentinel/:slug"
	 * - "/intro" were rendered at "/sentinel/intro/:slug"
	 * - "/downloads" was rendered at "/sentinel/downloads"
	 *
	 * In the new HashiCorp Developer UI:
	 * - "/docs" are rendered at "/sentinel/docs/:slug"
	 * - "/intro" are rendered at "/sentinel/intro/:slug" (same as before!)
	 * - "/downloads" is rendered at "/sentinel/downloads" (same as before!)
	 *
	 * Note that:
	 * - Any "/sentinel/<basePath>/:slug" URLs do not need to be modified
	 *   - This excludes the case where "basePath" is "docs"
	 *   - This really just applies to "/sentinel/intro", but in theory could
	 *     apply to other Sentinel "basePaths" if they get added
	 * - The "/sentinel/downloads" URL does not need to be modified
	 * - Any other "/sentinel/:slug" URL is expected to be a "/docs" URL
	 *   - We need to adjust these urls to be "/sentinel/docs/:slug"
	 */
	const isBasePathExceptDocs = sentinelData.basePaths
		.filter((p: string) => p !== 'docs')
		.some(
			(basePath: string) =>
				inputUrl == `/sentinel/${basePath}` ||
				inputUrl.startsWith(`/sentinel/${basePath}/`)
		)
	const isDownloadsUrl = inputUrl == '/sentinel/downloads'
	/**
	 * We assume all other "/sentinel/*" URLs are intended to be docs routes,
	 * which on the previous site were rendered to "/sentinel/:slug".
	 * We need to correct these URLs to be "/sentinel/docs/:slug".
	 */
	const isKnownUrl = isBasePathExceptDocs || isDownloadsUrl
	const isDocsUrl = !isKnownUrl && inputUrl.startsWith('/sentinel')
	if (isDocsUrl) {
		return `/sentinel/docs${inputUrl.replace('/sentinel', '')}`
	}

	// If we didn't match a docs URL, return the original URL
	return inputUrl
}
