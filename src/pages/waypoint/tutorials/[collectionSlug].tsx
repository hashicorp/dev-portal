import { LearnProductData } from 'types/products'
import CollectionView from 'views/collection-view'
import { generateStaticFunctions } from 'views/collection-view/server'
// product data
import waypointData from 'data/waypoint.json'

const { getStaticPaths, getStaticProps } = generateStaticFunctions(
	waypointData as LearnProductData
)
export { getStaticPaths, getStaticProps }

export default CollectionView
