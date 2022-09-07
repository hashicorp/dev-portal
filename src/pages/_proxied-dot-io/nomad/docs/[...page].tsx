import { Products } from '@hashicorp/platform-product-meta'
import NomadIoLayout from 'layouts/_proxied-dot-io/nomad'
import DocsPage from 'components/_proxied-dot-io/common/docs-page'
import Placement from 'components/author-primitives/shared/placement-table'
import productData from 'data/nomad.json'
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
const additionalComponents = { Placement }

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
DocsView.layout = NomadIoLayout
export default DocsView
