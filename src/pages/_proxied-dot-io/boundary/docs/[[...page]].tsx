import { Products } from '@hashicorp/platform-product-meta'
import BoundaryIoLayout from 'layouts/_proxied-dot-io/boundary'
import DocsPage from 'components/_proxied-dot-io/common/docs-page'
import productData from 'data/boundary.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from 'lib/_proxied-dot-io/get-static-generation-functions'

const product = { name: productData.name, slug: productData.slug as Products }
const basePath = 'docs'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = {}

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

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
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

// Export getStatic functions
export { getStaticPaths, getStaticProps }
// Export view with layout
DocsView.layout = BoundaryIoLayout
export default DocsView
