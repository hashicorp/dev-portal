import { LearnProductData } from 'types/products'
import CollectionView from 'views/collection-view'
import { generateStaticFunctions } from 'views/collection-view/server'
// product data
import vaultData from 'data/vault.json'

const { getStaticPaths, getStaticProps } = generateStaticFunctions(
	vaultData as LearnProductData
)
export { getStaticPaths, getStaticProps }

export default CollectionView
