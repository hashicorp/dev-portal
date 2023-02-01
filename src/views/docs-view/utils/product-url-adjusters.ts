import isAbsoluteUrl from 'lib/is-absolute-url'
import { productSlugs, productSlugsToHostNames } from 'lib/products'
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
	/**
	 * Sentinel is a bit of a special case,
	 * since it did not have a dedicated dot-io domain
	 */
	if (productData.slug === 'sentinel') {
		return (url: string) => rewriteSentinelDocsUrls(url, productData)
	}

	/**
	 * Vault and Consul (and possibly others?)
	 * have authored "/api" links which used to be redirected to "/api-docs",
	 * but which we're now preferring to handle by rewriting here.
	 */
	if (productData.slug === 'consul' || productData.slug === 'vault') {
		return (url: string) => {
			const withApiDocsFix = rewriteApiToApiDocs(url)
			const withProductPrefix = rewriteDocsUrl(withApiDocsFix, productData)
			return withProductPrefix
		}
	}

	/**
	 * All other products need their docs routes prefixed, as within docs
	 * content, authors write links as if URLs are on the dot-io sites.
	 * For example, in Waypoint content, authors write URLs like
	 * "/docs/some-waypoint-page", which need to be adjusted to be
	 * "/waypoint/docs/some-waypoint-page".
	 */
	return (url: string) => {
		// Do the base docs adjustment
		let adjustedUrl = rewriteDocsUrl(url, productData)
		// We also have some product-specific, post-adjustment rewrites to apply
		adjustedUrl = rewriteWaypointPluginsLink(adjustedUrl)
		// Return the final URL
		return adjustedUrl
	}
}

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
 *
 * For context:
 * Links were are sometimes authored as "/api", rather than "/api-docs",
 * which dates back to a time where "/api" did not conflict with NextJS routes.
 * We must fix /api URLs, which are really /api-docs (for compat with NextJS)
 * This would ideally be done in the source MDX.
 *
 * To fully deprecate the need for this rewriting of URLs, we'd need to fix
 * all "/api" links in both the current and all past versions of docs.
 * This may be feasible if we had a mechanism to apply remark transforms
 * across all versions of a product's documentation
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
 * For example, Waypoint content contains links that start with "/docs",
 * but we need to be adjust these links to start with "/waypoint/docs".
 */
export function rewriteDocsUrl(
	inputUrl: string,
	currentProduct: ProductData
): string {
	// We only want to adjust internal URLs, so we return absolute URLs, or anchor links, as-is
	if (
		isAbsoluteUrl(inputUrl) ||
		inputUrl.startsWith('#') ||
		inputUrl.startsWith('.') ||
		/(.png|.jpg|.svg)$/.test(inputUrl) // ignore image links
	) {
		return inputUrl
	}

	// If it goes to the home page (`/`), return the inputUrl unmodified
	const urlObject = new URL(inputUrl, 'https://developer.hashicorp.com')
	if (urlObject.pathname === '/') {
		return inputUrl
	}

	// Prefix docs URLs. "/docs/some-path" becomes "/waypoint/docs/some-path"
	const isCurrentProductDocsUrl = currentProduct.basePaths.some(
		(basePath: string) => inputUrl.startsWith(`/${basePath}`)
	)
	const isProductPath = new RegExp(`^/(${productSlugs.join('|')})`)

	if (isCurrentProductDocsUrl) {
		// The vagrant vmware utility downloads page is a unique case, where we did
		// adjust the url structure in the transition to devdot
		if (
			currentProduct.slug === 'vagrant' &&
			inputUrl.startsWith('/vmware/downloads')
		) {
			return `/${currentProduct.slug}/downloads/vmware`
		}
		return `/${currentProduct.slug}${inputUrl}`
	} else if (!isProductPath.test(inputUrl)) {
		// if the path doesnt already start with a product slug i.e. /consul/tutorials
		// and its not an absolute url we assume it is an internal .io link
		// for this product context that is not a docs link, and should link to the external .io site
		// For example, the vault use case pages, the hcp pricing page, etc.
		const url = new URL(
			inputUrl,
			`https://${productSlugsToHostNames[currentProduct.slug]}`
		)
		return url.toString()
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
 * Rewrite Waypoint `plugin` links to `integrations`.
 *
 * Waypoint /plugins have been moved to /integrations. We have redirects
 * set up to handle this, and we hope to update these links in content,
 * but as a temporary solution we can rewrite these links at compile time.
 *
 * Note: we intentionally run this _after_ URLs have been normalized to
 * include their product prefix. This way, regardless of whether Waypoint
 * content authors are writing `/plugins` or `/waypoint/plugins`, we should
 * apply the `plugins` → `integrations` rewrites correctly.
 *
 * TODO: We can remove this at some point.
 * It'll likely make sense once we've cleaned up old links in content.
 * The vast majority of these links are in the `hashicorp/waypoint` repo.
 * To view all places we link `/waypoint/plugins`:
 * - Within `hashicorp/waypoint`, these URLs would be written as `/plugins`.
 *   Code Search: https://cs.github.com/?scopeName=All+repos&scope=&q=repo%3Ahashicorp%2Fwaypoint+path%3A*.mdx+%22%2Fplugins%22
 * - In other repos, these URLs would be written as either
 *   waypoint.io/plugins, or developer.hashicorp.com/waypoint/plugins.
 *   Code Search for waypointproject.io: https://cs.github.com/?scopeName=All+repos&scope=&q=repo%3Ahashicorp%2Fterraform+OR+repo%3Ahashicorp%2Fpacker+OR+repo%3Ahashicorp%2Fconsul+OR+repo%3Ahashicorp%2Fvault+OR+repo%3Ahashicorp%2Fboundary+OR+repo%3Ahashicorp%2Fnomad+OR+repo%3Ahashicorp%2Fvagrant+OR+repo%3Ahashicorp%2Ftutorials+path%3A*.mdx+content%3Awaypointproject.io
 *   Code Search for `/waypoint/plugins` links: https://cs.github.com/?scopeName=All+repos&scope=&q=repo%3Ahashicorp%2Fterraform+OR+repo%3Ahashicorp%2Fpacker+OR+repo%3Ahashicorp%2Fconsul+OR+repo%3Ahashicorp%2Fvault+OR+repo%3Ahashicorp%2Fboundary+OR+repo%3Ahashicorp%2Fnomad+OR+repo%3Ahashicorp%2Fvagrant+OR+repo%3Ahashicorp%2Ftutorials+path%3A*.mdx+content%3A%2Fwaypoint%2Fplugins
 *
 * TODO: remove the section below, meant to be a PR comment, I'm lazy/
 * You can check that these rewrites have worked by visiting pages such as
 * `/waypoint/docs/plugins` or `/waypoint/docs/runner/on-demand-runner`,
 * which have links in content source that point to `/plugins`, but with
 * this logic in place, should have been rewritten to `/integrations`.
 *
 */
function rewriteWaypointPluginsLink(inputUrl: string): string {
	// Handle the root path
	if (inputUrl === '/waypoint/plugins') {
		return '/waypoint/integrations'
	}
	// Handle all plugins
	const pluginSlug = inputUrl.replace('/plugins/', '')
	// Note: under `/plugins` we only ever had official `hashicorp` plugins
	// TODO: confirm whether the above is true, I'm actually not sure
	//       (if this isn't true, could maybe do an old plugin name -> org map?)
	// TODO: update from `BrandonRomano` to `hashicorp` once API content updates
	const pluginOrg = 'BrandonRomano'
	return `/waypoint/integrations/${pluginOrg}/${pluginSlug}`
}

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
