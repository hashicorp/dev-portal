import vaultData from 'data/vault.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'views/docs-view/server'
import DocsView from 'views/docs-view'

const basePath = 'api-docs'
const baseName = 'API'
const product = vaultData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	product,
	basePath,
	baseName,
})

export { getStaticPaths, getStaticProps }
export default DocsView
