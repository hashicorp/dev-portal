import path from 'path'
import { visit } from 'unist-util-visit'
import { Image } from 'mdast'
import { Pluggable } from 'unified'
import {
	includeMarkdown,
	paragraphCustomAlerts,
	typography,
	anchorLinks,
} from '@hashicorp/remark-plugins'
import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'
import rehypePrism from '@mapbox/rehype-prism'
import { getStaticGenerationFunctions as getStaticGenerationFunctionsBase } from '@hashicorp/react-docs-page/server'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { ProductSlug } from 'types/products'

const MKTG_CONTENT_API_OLD = 'https://mktg-content-api-hashicorp.vercel.app'

const contentApi = new URL(process.env.MKTG_CONTENT_API)

// This Remark plugin rewrites img URLs from our Marketing Content Server API
// to Dev Portal's next/image optimization endpoint.
function remarkRewriteImageUrls() {
	return function plugin() {
		return function transformTree(tree) {
			visit<Image, string>(tree, 'image', (node) => {
				if (
					node.url.includes(process.env.MKTG_CONTENT_API) ||
					node.url.includes(MKTG_CONTENT_API_OLD)
				) {
					// Ensure we're serving assets from our content.hashicorp.com subdomain
					const assetUrl = new URL(node.url)
					assetUrl.host = contentApi.host

					const params = new URLSearchParams()
					params.set('url', assetUrl.toString())
					// next/image requires that we specify an allowed width. The .io docs
					// page renders images at 909 pixels wide. To support high DPI
					// displays, we double this value to 1818, and round up to the nearest
					// supported width of 1920.
					params.set('w', '1920')
					// By default, next/image uses a quality setting of 75.
					params.set('q', '75')

					node.url = `/_next/image?${params.toString()}`
				}
			})
		}
	}
}

/**
 * Given a loader strategy and a localPartialsDir,
 * return a set of remarkPlugins for use with dot-io docs content.
 *
 * Note on the anchorLinks plugin:
 * This is a somewhat unusual use of the anchorLinks plugin.
 * Normally, we'd pass an option to extract table-of-contents headings,
 * as we do for dev-dot docs views. At present, our docs-page component
 * handles building the table of contents client-side, so we don't do this.
 */
function getDotIoRemarkPlugins({
	strategy,
	localPartialsDir,
}: {
	strategy: 'remote' | 'fs'
	localPartialsDir: string
}): Pluggable[] {
	if (strategy === 'remote') {
		/**
		 * For remote loading, we already apply remark plugins in transforms.
		 * namely includeMarkdown and paragraphCustomAlerts.
		 * https://github.com/hashicorp/mktg-content-workflows/blob/main/shared/transforms/include-partials.ts
		 * https://github.com/hashicorp/mktg-content-workflows/blob/main/shared/transforms/paragraph-custom-alerts.ts
		 */
		return [typography, anchorLinks, remarkRewriteImageUrls()]
	} else {
		/**
		 * For local loading, we need the includeMarkdown plugin,
		 * as well as the paragraphCustomAlerts plugin.
		 *
		 * Note: fallback 'content/partials' value is here for completeness,
		 * it may never be used, and we may be able to cut it.
		 */
		const partialsDirWithFallback = localPartialsDir || 'content/partials'
		return [
			[
				includeMarkdown,
				{
					resolveMdx: true,
					resolveFrom: path.join(process.cwd(), partialsDirWithFallback),
				},
			],
			typography,
			anchorLinks,
			paragraphCustomAlerts,
		]
	}
}

export const getStaticGenerationFunctions: typeof getStaticGenerationFunctionsBase =
	(opts) => {
		if (!opts.revalidate && opts.strategy === 'remote') {
			opts.revalidate = __config.io_sites.revalidate
		}

		/**
		 * Build the set of remark plugins to use.
		 */
		const extraRemarkPlugins = Array.isArray(opts.remarkPlugins)
			? opts.remarkPlugins
			: []
		const defaultRemarkPlugins = getDotIoRemarkPlugins({
			strategy: opts.strategy,
			localPartialsDir: opts.strategy == 'fs' && opts.localPartialsDir,
		})
		opts.remarkPlugins = [...defaultRemarkPlugins, ...extraRemarkPlugins]

		/**
		 * Build the set of rehype plugins to use.
		 */
		opts.rehypePlugins = [
			[rehypePrism, { ignoreMissing: true }],
			rehypeSurfaceCodeNewlines,
		]

		const { getStaticPaths: getStaticPathsBase, getStaticProps } =
			getStaticGenerationFunctionsBase(opts)

		return {
			async getStaticPaths(ctx) {
				const result = await getStaticPathsBase(ctx)

				const isBetaProduct = getIsBetaProduct(opts.product as ProductSlug)

				// As we roll products out to GA, we want to limit how many paths we are pre-rendering to limit build time impact for pages which shouldn't get hit (.io docs pages). They can still be ISR'd.
				const pathsLimit = isBetaProduct
					? __config.io_sites.max_static_paths
					: 0

				return {
					...result,
					paths: result.paths.slice(0, pathsLimit),
				}
			},
			getStaticProps,
		}
	}
