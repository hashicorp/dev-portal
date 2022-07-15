import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'views/docs-view/server'
import DocsView from 'views/docs-view'

const basePath = 'intro'
const baseName = 'Intro'
const product = vagrantData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	product,
	basePath,
	baseName,
})

export { getStaticPaths, getStaticProps }
export default DocsView
