import { Products } from '@hashicorp/platform-product-meta'
import ConsulIoLayout from 'layouts/_proxied-dot-io/consul'
import DocsPage from 'components/_proxied-dot-io/common/docs-page'
import ConfigEntryReference from 'components/_proxied-dot-io/consul/config-entry-reference'
import productData from 'data/consul.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from 'lib/_proxied-dot-io/get-static-generation-functions'
import { GetStaticPathsContext, GetStaticPathsResult } from 'next'

const product = { name: productData.name, slug: productData.slug as Products }
const basePath = 'docs'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = { ConfigEntryReference }

function DocsView(props) {
	return (
		<DocsPage
			product={product}
			baseRoute={basePath}
			staticProps={props}
			additionalComponents={additionalComponents}
			showVersionSelect={enableVersionedDocs}
			algoliaConfig={productData.algoliaConfig}
			devDotCutoverInfo={{
				cutoverDate: productData.devDotCutoverDate,
				baseUrl: __config.dev_dot.canonical_base_url,
			}}
		/>
	)
}

const { getStaticPaths: generatedGetStaticPaths, getStaticProps } =
	getStaticGenerationFunctions(
		enableVersionedDocs
			? {
					strategy: 'remote',
					basePath,
					fallback: 'blocking',
					revalidate: 360, // 1 hour
					product: productData.slug,
			  }
			: {
					strategy: 'fs',
					localContentDir,
					navDataFile,
					localPartialsDir,
					product: productData.slug,
			  }
	)

// Export getStaticPaths function
/**
 * Note that we need to exclude the usually-included `/` empty path,
 * as otherwise, we'll have conflicting paths with our `/docs/index.tsx` file.
 * (and NextJS will get mad since this is not an "optional catch-all" route).
 */
export async function getStaticPaths(
	context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
	const { paths, ...restReturn } = await generatedGetStaticPaths(context)
	// eslint-disable-next-line @typescript-eslint/typedef
	const pathsWithoutIndex = paths.filter((pathEntry) => {
		const isIndexPath =
			typeof pathEntry == 'string'
				? pathEntry == ''
				: pathEntry.params.page.length == 0
		return !isIndexPath
	})
	return { ...restReturn, paths: pathsWithoutIndex }
}

// Export getStaticProps function
export { getStaticProps }

// Export view with layout
DocsView.layout = ConsulIoLayout
export default DocsView
