/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next'
import path from 'path'
import { Pluggable } from 'unified'
import slugify from 'slugify'

// HashiCorp Imports
import RemoteContentLoader from './loaders/remote-content'
import { anchorLinks } from '@hashicorp/remark-plugins'

// Global imports
import { ProductData, RootDocsPath } from 'types/products'
import { rehypeCodePlugins } from 'lib/rehype-code-plugins'
import remarkPluginAdjustLinkUrls from 'lib/remark-plugins/remark-plugin-adjust-link-urls'
import { isDeployPreview } from 'lib/env-checks'
import remarkPluginRemoveFirstH1 from 'lib/remark-plugins/remark-plugin-remove-first-h1'
import { getStaticPathsFromAnalytics } from 'lib/get-static-paths-from-analytics'
import outlineItemsFromHeadings, {
	AnchorLinksPluginHeading,
} from 'components/outline-nav/utils/outline-items-from-headings'
import addBrandedOverviewSidebarItem from 'lib/docs/add-branded-overview-sidebar-item'
import { rewriteTutorialLinksPlugin } from 'lib/remark-plugins/rewrite-tutorial-links'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import prepareNavDataForClient from 'layouts/sidebar-sidecar/utils/prepare-nav-data-for-client'
import getDocsBreadcrumbs from 'components/breadcrumb-bar/utils/get-docs-breadcrumbs'
import { SidebarProps } from 'components/sidebar'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import tutorialMap from 'data/_tutorial-map.generated.json'

// Local imports
import { getValidVersions } from './utils/get-valid-versions'
import { getProductUrlAdjuster } from './utils/product-url-adjusters'
import { getBackToLink } from './utils/get-back-to-link'
import { getDeployPreviewLoader } from './utils/get-deploy-preview-loader'
import { getCustomLayout } from './utils/get-custom-layout'
import type { DocsViewPropOptions } from './utils/get-root-docs-path-generation-functions'
import { DocsViewProps } from './types'
import { isReleaseNotesPage } from 'lib/docs/is-release-notes-page'

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
	options = {},
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
	options?: DocsViewPropOptions
}): {
	getStaticPaths: GetStaticPaths
	getStaticProps: GetStaticProps<DocsViewProps>
} {
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
			const pathsFromNavData = await getLoader().loadStaticPaths()

			if (isDeployPreview() && !isDeployPreview(productSlugForLoader)) {
				// do not statically render any other products if we are in a deploy preview for another product
				return {
					fallback: 'blocking',
					paths: [],
				}
			}

			// Render all paths for deploy previews in source repositories
			if (isDeployPreview(productSlugForLoader)) {
				return {
					fallback: 'blocking',
					paths: pathsFromNavData,
				}
			}

			if (productSlugForLoader === 'terraform-cdk') {
				// terraform-cdk has some exceptionally large pages that cannot be ISR'd due to lambda response size limits. As a result, we force the SSG of these pages.
				// TODO: remove this block when we come up with an alternative workaround to CDKTF's large pages
				return {
					paths: pathsFromNavData,
					fallback: 'blocking',
				}
			}

			// Otherwise, rely on analytics data to prune the paths
			const paths = await getStaticPathsFromAnalytics({
				limit: __config.dev_dot.max_static_paths ?? 0,
				pathPrefix: `/${product.slug}/${basePath}`,
				validPaths: pathsFromNavData,
			})

			return {
				fallback: 'blocking',
				paths,
			}
		},
		getStaticProps: async (
			ctx
		): Promise<GetStaticPropsResult<DocsViewProps>> => {
			const pathParts = (ctx.params.page || []) as string[]
			const currentPathUnderProduct = `/${path.join(
				basePathForLoader,
				pathParts.join('/')
			)}`
			const headings: AnchorLinksPluginHeading[] = [] // populated by anchorLinks plugin below

			const loader = getLoader({
				mainBranch,
				remarkPlugins: [
					...additionalRemarkPlugins,
					/**
					 * Note on remark plugins for local vs remote loading:
					 * includeMarkdown and paragraphCustomAlerts are already
					 * expected to have been run for remote content.
					 */
					[anchorLinks, { headings }],
					/**
					 * Remove the `<h1 />` from MDX, we'll render this outside
					 * the MDX content area, integrating it into our layout
					 * in various ways depending on the specific docs view used.
					 */
					remarkPluginRemoveFirstH1,
					/**
					 * The `contentType` configuration is necessary so that the
					 * `rewriteTutorialLinksPlugin` does not rewrite links like
					 * `/waypoint` to `/waypoint/tutorials`.
					 */
					[rewriteTutorialLinksPlugin, { contentType: 'docs', tutorialMap }],
					/**
					 * Rewrite docs content links, which are authored without prefix.
					 * For example, in Waypoint docs authors write "/docs/some-thing",
					 * we need this to be "/waypoint/docs/some-thing" for Dev Dot.
					 */
					[
						remarkPluginAdjustLinkUrls,
						{
							currentPath: currentPathUnderProduct,
							urlAdjustFn: getProductUrlAdjuster(product),
						},
					],
				],
				rehypePlugins: rehypeCodePlugins,
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
				console.error('[docs-view/server] error loading static props', error)

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
			 * Construct a page heading object from outline data.
			 * We'll render this to replace the `<h1 />` we're removed from MDX.
			 *
			 * This gives us flexibility in how we lay out the `<h1 />`,
			 * such as placing it in the same flex container as the version select,
			 * or constructing the "Landing Hero" on docs landing pages.
			 *
			 * Note: we expect a few document properties as
			 * asserted by our content conformance work:
			 * - We expect there to be an `<h1 />` in every docs `.mdx` document
			 * - We expect the `<h1 />` to be the first heading in the document
			 *
			 * However, we cannot guarantee these assumptions. If there is no `h1`
			 * in the MDX, we'll render without a page heading - this is something
			 * that should be fixed at the content level.
			 */
			let pageHeading: { id: string; title: string }
			const h1Match = headings.find(
				(h: AnchorLinksPluginHeading) => h.level === 1
			)
			if (h1Match) {
				pageHeading = {
					id: h1Match.slug,
					title: h1Match.title,
				}
			} else {
				const fallbackHeading = pathParts[pathParts.length - 1]
				pageHeading = {
					id: slugify(fallbackHeading, { lower: true }),
					title: fallbackHeading,
				}
			}

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
			const outlineItems = outlineItemsFromHeadings(nonEmptyHeadings)

			/**
			 * Add fullPaths and auto-generated ids to navData
			 */
			const { preparedItems: navDataWithFullPaths } =
				await prepareNavDataForClient({
					basePaths: [product.slug, basePath],
					nodes: navData,
					tutorialMap,
				})

			/**
			 * Figure out if a specific docs version is being viewed
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
			const docsSidebarTitle =
				currentRootDocsPath.shortName || currentRootDocsPath.name
			const docsBasePathFullPath = versionPathPart
				? `/${product.slug}/${basePath}/${versionPathPart}`
				: `/${product.slug}/${basePath}`
			/**
			 * Build menuItems from navData, with a branded "Overview" item
			 *
			 * TODO: would be great to fix up related types here at some point.
			 * task: https://app.asana.com/0/1202097197789424/1202405210286689/f
			 */
			const menuItems = addBrandedOverviewSidebarItem(navDataWithFullPaths, {
				title: docsSidebarTitle,
				fullPath: docsBasePathFullPath,
				theme: product.slug,
			}) as $TSFixMe
			const docsSidebarLevel: SidebarProps = {
				backToLinkProps: getBackToLink(currentRootDocsPath, product),
				levelButtonProps: {
					levelUpButtonText: `${product.name} Home`,
				},
				menuItems,
				title: docsSidebarTitle,
				/* We always visually hide the title, as we've added in a
				   "highlight" item that would make showing the title redundant. */
				visuallyHideTitle: true,
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
			const isRootPath = pathParts.length === 0 || pathParts[0] === ''
			const isDocsLanding = isRootPath && basePath === 'docs'
			const layoutProps: Omit<SidebarSidecarLayoutProps, 'children'> = {
				breadcrumbLinks,
				// TODO: need to adjust type for sidebarNavDataLevels here
				sidebarNavDataLevels: sidebarNavDataLevels as $TSFixMe,
				/* Long-form content pages use a narrower main area width */
				mainWidth: isDocsLanding ? 'wide' : 'narrow',
			}

			/**
			 * Filter versions to include only those where this document exists
			 */
			// Construct a document path that the content API will recognize
			const pathWithoutVersion = pathParts
				.filter((part) => part !== versionPathPart)
				.join('/')
			const fullPath = `doc#${path.join(basePathForLoader, pathWithoutVersion)}`
			// Filter for valid versions, fetching from the content API under the hood
			const validVersions = await getValidVersions(
				versions,
				fullPath,
				productSlugForLoader
			)

			/**
			 * Determine whether to show the version selector
			 *
			 * In most docs categories, we want to show the version selector if there
			 * are multiple versions, or if the single version is not `v0.0.x`.
			 * (We use `v0.0.x` as a placeholder version for un-versioned documentation)
			 */
			const hasMeaningfulVersions =
				validVersions.length > 0 &&
				(validVersions.length > 1 || validVersions[0].version !== 'v0.0.x')

			/**
			 * We want to show "Edit on GitHub" links for public content repos only.
			 * Currently, HCP and Sentinel docs are stored in private repositories.
			 *
			 * Note: If we need more granularity here, we could change this to be
			 * part of `rootDocsPath` configuration in `src/data/<product>.json`.
			 */
			const isPublicContentRepo = !['hcp', 'sentinel', 'terraform'].includes(
				product.slug
			)
			if (isPublicContentRepo) {
				layoutProps.githubFileUrl = githubFileUrl
			}

			const { hideVersionSelector, projectName } = options

			/**
			 * TODO: the DocsViewProps type should likely be set at the
			 * function return value level, rather than only here.
			 * Setting here for now to keep things in scope for current work.
			 */
			const finalProps: DocsViewProps = {
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
				outlineItems,
				pageHeading,
				mdxSource,
				product: {
					...product,
					// needed for DocsVersionSwitcher
					currentRootDocsPath: currentRootDocsPath || null,
				},
				projectName: projectName || null,
				versions:
					!hideVersionSelector &&
					!isReleaseNotesPage(currentPathUnderProduct) && // toggle version dropdown
					hasMeaningfulVersions
						? validVersions
						: null,
			}

			return {
				revalidate: __config.dev_dot.revalidate,
				props: finalProps,
			}
		},
	}
}
