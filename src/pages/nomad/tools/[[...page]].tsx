import nomadData from 'data/nomad.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'

const basePath = 'tools'
const baseName = 'Tools'
const product = nomadData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	product,
	basePath,
	baseName,
	showVersionSelect: false,
})

export { getStaticPaths, getStaticProps }
export default DocsView
