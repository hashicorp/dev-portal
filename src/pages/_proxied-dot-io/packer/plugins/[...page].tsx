import { Products } from '@hashicorp/platform-product-meta'
import { InferGetStaticPropsType } from 'next'
import PackerIoLayout from 'layouts/_proxied-dot-io/packer'
import DocsPage from 'components/_proxied-dot-io/common/docs-page'

import Badge from 'components/_proxied-dot-io/packer/badge'
import BadgesHeader from 'components/_proxied-dot-io/packer/badges-header'
import PluginBadge from 'components/_proxied-dot-io/packer/plugin-badge'
import Checklist from 'components/_proxied-dot-io/packer/checklist'
import productData from 'data/packer.json'
// Imports below are only used server-side
import {
	generateStaticPaths,
	generateStaticProps,
} from 'components/_proxied-dot-io/packer/remote-plugin-docs/server'

//  Configure the docs path and remote plugin docs loading

// path relative to the `website` directory of the Packer GitHub repo
const remotePluginsFile = 'data/plugins-manifest.json'

const product = { name: productData.name, slug: productData.slug as Products }
const basePath = 'plugins'
// path relative to the `website` directory of the Packer GitHub repo
const navDataFile = `data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const additionalComponents = { Badge, BadgesHeader, PluginBadge, Checklist }
const mainBranch = 'stable-website'

function DocsView(props: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<DocsPage
			additionalComponents={additionalComponents}
			baseRoute={basePath}
			product={product}
			staticProps={props}
			showVersionSelect={false}
			algoliaConfig={productData.algoliaConfig}
			devDotCutoverMessage={productData.devDotCutoverMessage}
		/>
	)
}

export async function getStaticPaths() {
	let paths = await generateStaticPaths({
		navDataFile,
		remotePluginsFile,
		mainBranch,
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

export async function getStaticProps({ params }) {
	const props = await generateStaticProps({
		localContentDir,
		mainBranch,
		navDataFile,
		params,
		product,
		remotePluginsFile,
	})
	if (!props) {
		return { notFound: true }
	}
	return { props, revalidate: __config.io_sites.revalidate }
}

DocsView.layout = PackerIoLayout
export default DocsView
