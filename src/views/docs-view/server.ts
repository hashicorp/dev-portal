// Third-party imports
import { Pluggable } from 'unified'
import rehypePrism from '@mapbox/rehype-prism'

// HashiCorp Imports
import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import RemoteContentLoader from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { anchorLinks } from '@hashicorp/remark-plugins'

// Global imports
import { ProductData, RootDocsPath } from 'types/products'
import remarkPluginAdjustLinkUrls from 'lib/remark-plugin-adjust-link-urls'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { isDeployPreview } from 'lib/env-checks'
import { rewriteTutorialLinksPlugin } from 'lib/remark-plugins/rewrite-tutorial-links'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import prepareNavDataForClient from 'layouts/sidebar-sidecar/utils/prepare-nav-data-for-client'
import getDocsBreadcrumbs from 'components/breadcrumb-bar/utils/get-docs-breadcrumbs'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'

// Local imports
import { getProductUrlAdjuster } from './utils/product-url-adjusters'
import { SidebarProps } from 'components/sidebar'
import { EnrichedNavItem } from 'components/sidebar/types'
import { getBackToLink } from './utils/get-back-to-link'
import { getDeployPreviewLoader } from './utils/get-deploy-preview-loader'
import { getCustomLayout } from './utils/get-custom-layout'

/**
 * Given a productSlugForLoader (which generally corresponds to a repo name),
 * Return the ref to use for remote content when the product is marked "beta".
 *
 * Note: for products where we intend to use the latest ref according
 * to the marketing content API, we return undefined.
 *
 * TODO: this is not intended as a permanent solution.
 * At present, it seems likely we'll transition away from using "dev-portal"
 * branches, and instead focus on backwards-compatible content changes
 * until each product is generally available on developer.hashicorp.com.
 *
 * Once we've moved away from "dev-portal" branches, this function
 * will no longer be necessary, and we will no longer pass the
 * "latestVersionRef" to the remote content loader config.
 */
function getBetaLatestVersionRef(slug: string): string | undefined {
	const hasDevPortalBranch = [
		'vault',
		'waypoint',
		'boundary',
		'consul',
		'nomad',
		'terraform-docs-common',
		'ptfe-releases',
		'terraform-cdk',
		'terraform',
		'terraform-plugin-sdk',
		'terraform-plugin-framework',
		'terraform-docs-agents',
	].includes(slug)
	return hasDevPortalBranch ? 'dev-portal' : undefined
}

/**
 * Returns static generation functions which can be exported from a page to fetch docs data
 *
 * Example usage:
 *
 * ```ts
 * const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
 *   product,
 *   basePath,
 * })
 *
 * export { getStaticPaths, getStaticProps }
 * ```
 */
export function getStaticGenerationFunctions<
	MdxScope = Record<string, unknown>
>({
	product,
	basePath,
	productSlugForLoader = product.slug,
	basePathForLoader = basePath,
	baseName,
	additionalRemarkPlugins = [],
	getScope = async () => ({} as MdxScope),
	mainBranch,
	navDataPrefix,
}: {
	product: ProductData
	basePath: string
	productSlugForLoader?: string
	basePathForLoader?: string
	baseName: string
	additionalRemarkPlugins?: Pluggable[]
	getScope?: () => Promise<MdxScope>
	mainBranch?: string
	navDataPrefix?: string
}): ReturnType<typeof _getStaticGenerationFunctions> {
	/**
	 * Beta products, defined in our config files, will source content from a
	 * long-lived branch named 'dev-portal'
	 */
	const isBetaProduct = getIsBetaProduct(product.slug)

	/**
	 * Get the current `rootDocsPaths` object.
	 *
	 * @TODO - set `baseName` using `rootDocsPath`
	 */
	const currentRootDocsPath = product.rootDocsPaths?.find(
		(rootDocsPath: RootDocsPath) => rootDocsPath.path === basePath
	)

	const loaderOptions: RemoteContentLoader['opts'] = {
		product: productSlugForLoader,
		basePath: basePathForLoader,
		enabledVersionedDocs: true,
		navDataPrefix,
		/**
		 * Note: not all products in "beta" are expected to have a specific
		 * "content_preview_branch", so even for products marked "beta",
		 * "latestVersionRef" may end up being undefined.
		 */
		latestVersionRef: isBetaProduct
			? getBetaLatestVersionRef(productSlugForLoader)
			: undefined,
	}

	// Defining a getter here so that we can pass in remarkPlugins on a per-request basis to collect headings
	const getLoader = (
		extraOptions?: Partial<ConstructorParameters<typeof RemoteContentLoader>[0]>
	) => {
		if (isDeployPreview(productSlugForLoader)) {
			return getDeployPreviewLoader({
				basePath,
				currentRootDocsPath,
				loaderOptions: {
					...loaderOptions,
					...extraOptions,
				},
			})
		} else {
			return new RemoteContentLoader({ ...loaderOptions, ...extraOptions })
		}
	}

	return {
		getStaticPaths: async () => {
			let paths = await getLoader().loadStaticPaths()

			if (isDeployPreview() && !isDeployPreview(productSlugForLoader)) {
				// do not statically render any other products if we are in a deploy preview for another product
				paths = []
			}

			return {
				fallback: 'blocking',
				paths: paths.slice(0, __config.dev_dot.max_static_paths ?? 0),
			}
		},
		getStaticProps: async (ctx) => {
			const pathParts = (ctx.params.page || []) as string[]
			const headings = [] // populated by anchorLinks plugin below

			const loader = getLoader({
				mainBranch,
				remarkPlugins: [
					/**
					 * Note on remark plugins for local vs remote loading:
					 * includeMarkdown and paragraphCustomAlerts are already
					 * expected to have been run for remote content.
					 */
					[anchorLinks, { headings }],
					rewriteTutorialLinksPlugin,
					/**
					 * Rewrite docs content links, which are authored without prefix.
					 * For example, in Waypoint docs authors write "/docs/some-thing",
					 * we need this to be "/waypoint/docs/some-thing" for Dev Dot.
					 */
					[
						remarkPluginAdjustLinkUrls,
						{ urlAdjustFn: getProductUrlAdjuster(product) },
					],
					...additionalRemarkPlugins,
				],
				rehypePlugins: [
					[rehypePrism, { ignoreMissing: true }],
					rehypeSurfaceCodeNewlines,
				],
				scope: await getScope(),
			})

			/**
			 * Try to load the static props for the given context. If there is a
			 * ContentApiError with a 404 status, return a 404 status and page.
			 * https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
			 */
			let loadStaticPropsResult
			try {
				loadStaticPropsResult = await loader.loadStaticProps(ctx)
			} catch (error) {
				// Catch 404 errors, return a 404 status page
				if (error.status === 404) {
					return { notFound: true }
				}

				// Throw non-404 errors
				throw error
			}

			const { navData, mdxSource, githubFileUrl, versions, frontMatter } =
				loadStaticPropsResult

			/**
			 * NOTE: we've encountered empty headings on at least one page:
			 * "/terraform/enterprise/install/automated/active-active"
			 * Passing empty headings to the client creates broken behaviour,
			 * so we filter them out.
			 * TODO: This change should perhaps be moved into our anchor-links plugin.
			 * Either way, we will likely need to keep this fix in place indefinitely,
			 * UNLESS we either fix all past versions of docs, OR implement a version
			 * cutoff that excludes all past versions of docs with this issue.
			 */
			const nonEmptyHeadings = headings.slice().filter(({ title }) => {
				const isValid = typeof title == 'string' && title !== ''
				if (isValid) {
					return true
				} else {
					const paramsAsPath =
						typeof ctx.params.page == 'string'
							? ctx.params.page
							: ctx.params.page.join('/')
					console.warn(
						`Found an empty title on page "/${product.slug}/${basePath}/${paramsAsPath}". Empty titles are omitted from our sidebar. Ideally, they should be removed in the source MDX.`
					)
				}
			})

			/**
			 * Add fullPaths and auto-generated ids to navData
			 */
			const { preparedItems: navDataWithFullPaths } = prepareNavDataForClient({
				basePaths: [product.slug, basePath],
				nodes: navData,
			})

			/**
			 * Figure out of a specific docs version is being viewed
			 */
			let indexOfVersionPathPart
			let versionPathPart
			if (versions) {
				pathParts.find((pathPart, index) => {
					const matchingVersion = versions.find(
						(version) => pathPart === version.version
					)
					if (matchingVersion) {
						versionPathPart = pathPart
						indexOfVersionPathPart = index
						return true
					}
				})
			}

			/**
			 * Constructs the base sidebar level for `DocsView`.
			 */
			const docsSidebarLevel: SidebarProps = {
				backToLinkProps: getBackToLink(currentRootDocsPath, product),
				levelButtonProps: {
					levelUpButtonText: `${product.name} Home`,
				},
				menuItems: navDataWithFullPaths as EnrichedNavItem[],
				title: currentRootDocsPath.shortName || currentRootDocsPath.name,
			}
			// If the title is not hidden for this rootDocsPath, include it
			if (currentRootDocsPath.visuallyHideSidebarTitle) {
				docsSidebarLevel.visuallyHideTitle = true
			}
			// Add "Overview" item, unless explicitly disabled
			if (currentRootDocsPath.addOverviewItem !== false) {
				docsSidebarLevel.overviewItemHref = versionPathPart
					? `/${product.slug}/${basePath}/${versionPathPart}`
					: `/${product.slug}/${basePath}`
			}

			/**
			 * Assembles all levels of sidebar nav data for `DocsView`.
			 */
			const sidebarNavDataLevels = [
				generateTopLevelSidebarNavData(product.name),
				generateProductLandingSidebarNavData(product),
				docsSidebarLevel,
			]

			const breadcrumbLinks = getDocsBreadcrumbs({
				baseName,
				basePath,
				indexOfVersionPathPart,
				navData: navDataWithFullPaths,
				pathParts,
				product,
				version: versionPathPart,
			})

			/**
			 * Construct layoutProps for the DocsView.
			 */
			const layoutProps: Omit<SidebarSidecarLayoutProps, 'children'> = {
				breadcrumbLinks,
				headings: nonEmptyHeadings,
				// TODO: need to adjust type for sidebarNavDataLevels here
				sidebarNavDataLevels: sidebarNavDataLevels as $TSFixMe,
			}

			/**
			 * Determine whether to show the version selector
			 *
			 * In most docs categories, we want to show the version selector if there
			 * are multiple versions, or if the single version is not `v0.0.x`.
			 * (We use `v0.0.x` as a placeholder version for un-versioned documentation)
			 */
			const hasMeaningfulVersions =
				versions.length > 0 &&
				(versions.length > 1 || versions[0].version !== 'v0.0.x')
			/**
			 * For the /packer/plugins landing page, we want to hide the version selector,
			 * even though we do have meaningful versions available
			 */
			const isPackerPlugins =
				product.slug == 'packer' && currentRootDocsPath.path == 'plugins'

			if (!isPackerPlugins && hasMeaningfulVersions) {
				layoutProps.versions = versions
			}
			/**
			 * We want to show "Edit on GitHub" links for public content repos only.
			 * Currently, HCP and Sentinel docs are stored in private repositories.
			 *
			 * Note: If we need more granularity here, we could change this to be
			 * part of `rootDocsPath` configuration in `src/data/<product>.json`.
			 */
			const isHcp = product.slug == 'hcp'
			const isSentinel = product.slug == 'sentinel'
			const isPublicContentRepo = !isHcp && !isSentinel
			if (isPublicContentRepo) {
				layoutProps.githubFileUrl = githubFileUrl
			}

			const finalProps = {
				layoutProps,
				metadata: {
					title: frontMatter.page_title ?? null,
					description: frontMatter.description ?? null,
					layout: getCustomLayout({
						currentRootDocsPath,
						frontMatter,
						pathParts,
					}),
				},
				mdxSource,
				product: {
					...product,
					// needed for DocsVersionSwitcher
					currentRootDocsPath: currentRootDocsPath || null,
				},
				versions,
			}

			return {
				revalidate: __config.dev_dot.revalidate,
				props: finalProps,
			}
		},
	}
}
