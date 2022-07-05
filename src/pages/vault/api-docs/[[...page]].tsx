import vaultData from 'data/vault.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'
import { vaultUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'

const basePath = 'api-docs'
const baseName = 'API'
const product = vaultData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	product,
	basePath,
	baseName,
	additionalRemarkPlugins: [vaultUrlAdjuster],
})

export { getStaticPaths, getStaticProps }
export default DocsView
