import { LearnProductData } from 'types/products'
import CollectionView from 'views/collection-view'
import { generateStaticFunctions } from 'views/collection-view/server'
// product data
import terraformData from 'data/terraform.json'

const { getStaticPaths, getStaticProps } = generateStaticFunctions(
	terraformData as LearnProductData
)
export { getStaticPaths, getStaticProps }

export default CollectionView
