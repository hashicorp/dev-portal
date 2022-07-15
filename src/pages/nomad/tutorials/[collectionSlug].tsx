import { LearnProductData } from 'types/products'
import CollectionView from 'views/collection-view'
import { generateStaticFunctions } from 'views/collection-view/server'
// product data
import nomadData from 'data/nomad.json'

const { getStaticPaths, getStaticProps } = generateStaticFunctions(
	nomadData as LearnProductData
)
export { getStaticPaths, getStaticProps }

export default CollectionView
