import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'views/docs-view/server'
import DocsView from 'views/docs-view'

const basePath = 'plugins'
const baseName = 'Plugins'
const product = waypointData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	product,
	basePath,
	baseName,
})

export { getStaticPaths, getStaticProps }
export default DocsView
