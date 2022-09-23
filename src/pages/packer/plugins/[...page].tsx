import DocsView from 'views/docs-view'
// Imports below are only used server-side
import { cachedGetProductData } from 'lib/get-product-data'
import {
	generateStaticPaths,
	generateStaticProps,
} from 'components/_proxied-dot-io/packer/remote-plugin-docs/server'
import { getPathBreadcrumbs } from 'components/breadcrumb-bar/utils/get-docs-breadcrumbs'
import prepareNavDataForClient from 'layouts/sidebar-sidecar/utils/prepare-nav-data-for-client'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import { isDeployPreview } from 'lib/env-checks'

const basePath = 'plugins'
const baseName = 'Plugins'
/**
 * Paths relative to the `website` directory of the Packer GitHub repo.
 *
 * Note that these are not currently used, as we don't yet support local
 * preview for the dev dot UI. They've been retained to avoid too
 * broad of a refactor to utilities shared with dot-io (where local
 * preview is actively supported).
 */
const remotePluginsFile = 'data/plugins-manifest.json'
const navDataFile = `data/${basePath}-nav-data.json`

export async function getStaticPaths() {
	let paths = []

	// Only generate static paths if we are not in a content deploy preview, or if we are in packer's content deploy preview
	if (!isDeployPreview() || isDeployPreview('packer')) {
		paths = await generateStaticPaths({
			navDataFile,
			remotePluginsFile,
		})
		paths = paths
			// remove index-ish pages from static paths
			.filter((p) => p.params.page.filter(Boolean).length > 0)
			// limit number of paths to max_static_paths
			.slice(0, __config.dev_dot.max_static_paths ?? 0)
	}

	return {
		paths,
		fallback: 'blocking',
	}
}

export async function getStaticProps({ params, ...ctx }) {
	/**
	 * Get product data
	 */
	const productData = cachedGetProductData('packer')

	/**
	 * Get static props for the page.
	 * Note that this function is intended for use with dot-io layouts,
	 * so we need to massage the data further before returning it
	 * for use on this Dev Dot view.
	 */
	const props = await generateStaticProps({
		localContentDir: `../content/${basePath}`,
		mainBranch: 'master',
		navDataFile,
		params,
		product: { name: productData.name, slug: productData.slug },
		remotePluginsFile,
	})

	/**
	 * If the params don't match an existing plugin, generateStaticProps
	 * above will return null. If a URL that doesn't match a plugin is
	 * visited, we want to ensure it returns a 404.
	 */
	if (!props) {
		return { notFound: true }
	}

	/**
	 * Prepare nav data for client, eg adding `fullPath`
	 */
	const { preparedItems: navData } = await prepareNavDataForClient({
		basePaths: [productData.slug, basePath],
		nodes: props.navData,
	})

	/**
	 * Constructs the levels of nav data.
	 */
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(productData.name),
		generateProductLandingSidebarNavData(productData),
		{
			backToLinkProps: {
				text: `${productData.name} Home`,
				href: `/${productData.slug}`,
			},
			levelButtonProps: {
				levelUpButtonText: `${productData.name} Home`,
			},
			menuItems: navData,
			title: baseName,
			overviewItemHref: `/${productData.slug}/${basePath}`,
		},
	]

	/**
	 * Construct breadcrumbs
	 */
	const rawPathBreadcrumbs = getPathBreadcrumbs({
		basePath: `${productData.slug}/${basePath}`,
		navData,
		pathParts: (params.page || []) as string[],
	})
	/**
	 * Breadcrumb construction is based on the path parts in our URL.
	 * We are typically able to assume that the navData structure reflects
	 * URL structure, as this was an explicit goal when the current format
	 * of navData was introduced. However, for plugins this assumption
	 * does not hold - the sidebar is organized at the top level by
	 * plugin name (such as "AWS"), while our URL structure is organized
	 * at the top level by plugin type (such as "Builder").
	 *
	 * To account for this, we need to manually modify the breadcrumbs
	 * we generate using our shared method.
	 *
	 * Specifically, the second item in the array of path-based breadcrumbs
	 * should be the name of the plugin, NOT the name of the plugin type
	 * (which is what we'd get otherwise due to nav data structure).
	 * We make this modification below.
	 */
	const pathBreadcrumbs = rawPathBreadcrumbs.map((item, idx) => {
		if (idx == 1) {
			return {
				title: props.navNode.pluginData.title,
				key: props.navNode.pluginData.repo,
			}
		}
		return item
	})
	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: productData.name, url: `/${productData.slug}` },
		{
			title: baseName,
			url: `/${productData.slug}/${basePath}`,
		},
		...pathBreadcrumbs,
	]

	/**
	 * Assemble and return static  props for the view
	 */
	return {
		props: {
			layoutProps: {
				breadcrumbLinks,
				githubFileUrl: props.githubFileUrl,
				headings: props.headings,
				sidebarNavDataLevels,
			},
			metadata: {
				title: props.frontMatter.page_title ?? null,
				description: props.frontMatter.description ?? null,
			},
			mdxSource: props.mdxSource,
			product: productData,
		},
		revalidate: __config.dev_dot.revalidate,
	}
}

export default DocsView
