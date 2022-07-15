import nomadData from 'data/nomad.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'views/docs-view/server'
import DocsView from 'views/docs-view'

const basePath = 'plugins'
const baseName = 'Plugins'
const product = nomadData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	product,
	basePath,
	baseName,
	showVersionSelect: false,
})

export { getStaticPaths, getStaticProps }
export default DocsView
