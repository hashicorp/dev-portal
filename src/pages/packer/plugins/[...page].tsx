import { Products } from '@hashicorp/platform-product-meta'
import DocsViewActual from 'views/docs-view'
// import { InferGetStaticPropsType } from 'next'
// import Badge from 'components/_proxied-dot-io/packer/badge'
// import BadgesHeader from 'components/_proxied-dot-io/packer/badges-header'
// import PluginBadge from 'components/_proxied-dot-io/packer/plugin-badge'
// import Checklist from 'components/_proxied-dot-io/packer/checklist'
// Imports below are only used server-side
import { getPathBreadcrumbs } from 'components/breadcrumb-bar/utils/get-docs-breadcrumbs'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	generateStaticPaths,
	generateStaticProps,
} from 'components/_proxied-dot-io/packer/remote-plugin-docs/server'
import { getRootDocsPathGenerationFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'
import { appendRemotePluginsNavData } from 'components/_proxied-dot-io/packer/remote-plugin-docs/server'
import prepareNavDataForClient from 'layouts/sidebar-sidecar/utils/prepare-nav-data-for-client'

//  Configure the docs path and remote plugin docs loading
// path relative to the `website` directory of the Packer GitHub repo
const remotePluginsFile = 'data/plugins-manifest.json'

// We use the same getStaticProps function as all other Dev Dot docs routes
const { getStaticProps: baseGetStaticProps } =
	getRootDocsPathGenerationFunctions('packer', 'plugins')

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
	 * TODO - these are arbitrary props that work with dev dot,
	 * these are a placeholder while I adapt the dot-io props below.
	 * Should eliminate this entirely, I think.
	 */
	const staticProps = await baseGetStaticProps({ params: {}, ...ctx })

	/**
	 * TODO - these are the props we really want to use,
	 * but they're designed for use with dot-io layout, and need to be adapted
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
	 * Merge in remote plugin data sidebar items
	 */
	let navData
	if ('props' in staticProps) {
		// Partial nav data is provided from base getStaticProps
		const partialNavData =
			staticProps.props.layoutProps.sidebarNavDataLevels[2].menuItems
		// We fetch and merge in remote plugins nav data
		const rawNavData = await appendRemotePluginsNavData(
			remotePluginsFile,
			partialNavData,
			''
		)
		// Prepare nav data for client, eg adding `fullPath`
		const { preparedItems } = prepareNavDataForClient({
			basePaths: ['packer', 'plugins'],
			nodes: rawNavData,
		})
		navData = preparedItems

		// Replace our original navData with our prepared navData
		staticProps.props.layoutProps.sidebarNavDataLevels[2].menuItems = navData
	}

	/**
	 * Layout props
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
	/**
	 * TODO: replace use of these layout props with non-placeholder
	 */
	const { sidebarNavDataLevels } =
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		/* @ts-ignore */
		staticProps.props.layoutProps

	/**
	 * TODO: replace use of these props with non-placeholder
	 */
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	/* @ts-ignore */
	// const { product } = staticProps.props

	return {
		props: {
			// _actualProps: props,
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
