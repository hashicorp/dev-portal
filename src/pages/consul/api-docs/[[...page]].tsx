import consulData from 'data/consul.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'views/docs-view/server'
import DocsView from 'views/docs-view'

const basePath = 'api-docs'
const baseName = 'API'
const product = consulData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	product,
	basePath,
	baseName,
})

export { getStaticPaths, getStaticProps }
export default DocsView
