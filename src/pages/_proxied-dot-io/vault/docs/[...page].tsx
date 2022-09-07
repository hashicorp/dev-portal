import { Products } from '@hashicorp/platform-product-meta'
import VaultIoLayout from 'layouts/_proxied-dot-io/vault'
import Columns from 'components/_proxied-dot-io/vault/columns'
import Tag from 'components/_proxied-dot-io/vault/inline-tag'
import DocsPage from 'components/_proxied-dot-io/common/docs-page'
import productData from 'data/vault.json'
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
const additionalComponents = { Columns, Tag }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function DocsView(props) {
	return (
		<DocsPage
			product={product}
			baseRoute={basePath}
			staticProps={props}
			additionalComponents={additionalComponents}
			showVersionSelect={enableVersionedDocs}
			algoliaConfig={productData.algoliaConfig}
			devDotCutoverMessage={productData.devDotCutoverMessage}
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
DocsView.layout = VaultIoLayout
export default DocsView
