import { Products } from '@hashicorp/platform-product-meta'
import VagrantIoLayout from 'layouts/_proxied-dot-io/vagrant'
import DocsPage from 'components/_proxied-dot-io/common/docs-page'
import Button from '@hashicorp/react-button'
import productData from 'data/vagrant.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

const product = { name: productData.name, slug: productData.slug as Products }
const basePath = 'docs'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = { Button }

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
				revalidate: 360, // 1 hour
				product: productData.slug,
				scope: { VMWARE_UTILITY_VERSION: productData.vmwareUtilityVersion },
		  }
		: {
				strategy: 'fs',
				localContentDir,
				navDataFile,
				localPartialsDir,
				product: productData.slug,
				scope: { VMWARE_UTILITY_VERSION: productData.vmwareUtilityVersion },
		  }
)

// Export getStatic functions
export { getStaticPaths, getStaticProps }
// Export view with layout
DocsView.layout = VagrantIoLayout
export default DocsView
