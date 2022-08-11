import { Products } from '@hashicorp/platform-product-meta'
import DocsViewActual from 'views/docs-view'
// import { InferGetStaticPropsType } from 'next'
// import Badge from 'components/_proxied-dot-io/packer/badge'
// import BadgesHeader from 'components/_proxied-dot-io/packer/badges-header'
// import PluginBadge from 'components/_proxied-dot-io/packer/plugin-badge'
// import Checklist from 'components/_proxied-dot-io/packer/checklist'
// Imports below are only used server-side
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import { getPathBreadcrumbs } from 'components/breadcrumb-bar/utils/get-docs-breadcrumbs'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	generateStaticPaths,
	generateStaticProps,
} from 'components/_proxied-dot-io/packer/remote-plugin-docs/server'
import prepareNavDataForClient from 'layouts/sidebar-sidecar/utils/prepare-nav-data-for-client'

//  Configure the docs path and remote plugin docs loading
// path relative to the `website` directory of the Packer GitHub repo
const remotePluginsFile = 'data/plugins-manifest.json'

// const product = { name: productData.name, slug: productData.slug as Products }
const basePath = 'plugins'
// path relative to the `website` directory of the Packer GitHub repo
const navDataFile = `data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
// const additionalComponents = { Badge, BadgesHeader, PluginBadge, Checklist }
const mainBranch = 'master'

function DocsView(props) {
	return (
		<>
			{/* <pre>
				<code>/packer/plugins/{props.currentPath}</code>
			</pre>
			<pre>
				<code>{JSON.stringify(props._actualProps, null, 2)}</code>
			</pre> */}
			<DocsViewActual {...props} />
		</>
	)
}

export async function getStaticPaths() {
	let paths = await generateStaticPaths({
		navDataFile,
		remotePluginsFile,
	})
	paths = paths
		// remove index-ish pages from static paths
		.filter((p) => p.params.page.filter(Boolean).length > 0)
		// limit number of paths to max_static_paths
		.slice(0, __config.io_sites.max_static_paths ?? 0)
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
		localContentDir,
		mainBranch,
		navDataFile,
		params,
		product: { name: productData.name, slug: productData.slug as Products },
		remotePluginsFile,
	})
	if (!props) {
		return { notFound: true }
	}

	/**
	 * Prepare nav data for client, eg adding `fullPath`
	 */
	const { preparedItems: navData } = prepareNavDataForClient({
		basePaths: ['packer', 'plugins'],
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
			title: 'Plugins',
			overviewItemHref: `/${productData.slug}/plugins`,
		},
	]

	/**
	 * Assemble layout props
	 */
	const pathParts = (params.page || []) as string[]
	const pathBreadcrumbs = getPathBreadcrumbs({
		basePath: `packer/plugins`,
		navData,
		pathParts,
	}).map((item, idx) => {
		/**
		 * TODO: explain this better, we need to manually sub in a breadcrumb here
		 * because normally breadcrumb construction relies on sidebar navData,
		 * but the way the plugins sidebar is organized and constructed is
		 * very different than on other pages.
		 */
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
			title: 'Plugins',
			url: '/packer/plugins',
		},
		...pathBreadcrumbs,
	]
	//
	const githubFileUrl = props.githubFileUrl
	const headings = props.headings

	return {
		props: {
			layoutProps: {
				breadcrumbLinks,
				githubFileUrl,
				headings,
				sidebarNavDataLevels,
			},
			metadata: {
				title: props.frontMatter.page_title ?? null,
				description: props.frontMatter.description ?? null,
			},
			mdxSource: props.mdxSource,
			product: productData,
		},
		revalidate: __config.io_sites.revalidate,
	}
}

DocsView.layout = DocsViewActual.layout
export default DocsView
