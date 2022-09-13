import PackerIoLayout from 'layouts/_proxied-dot-io/packer'
import DocsPage from 'components/_proxied-dot-io/common/docs-page'
import productData from 'data/packer.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
import Badge from 'components/_proxied-dot-io/packer/badge'
import BadgesHeader from 'components/_proxied-dot-io/packer/badges-header'
import PluginBadge from 'components/_proxied-dot-io/packer/plugin-badge'
import Checklist from 'components/_proxied-dot-io/packer/checklist'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from 'lib/_proxied-dot-io/get-static-generation-functions'

const product = { name: productData.name, slug: productData.slug }
const basePath = 'docs'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = { Badge, BadgesHeader, PluginBadge, Checklist }

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
DocsView.layout = PackerIoLayout
export default DocsView
