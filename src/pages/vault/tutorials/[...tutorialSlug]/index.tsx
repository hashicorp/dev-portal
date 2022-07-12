import { LearnProductData } from 'types/products'
import TutorialView from 'views/tutorial-view'
import { generateStaticFunctions } from 'views/tutorial-view/server'
// product data
import vaultData from 'data/vault.json'

const { getStaticPaths, getStaticProps } = generateStaticFunctions(
	vaultData as LearnProductData
)

export { getStaticPaths, getStaticProps }
export default TutorialView
