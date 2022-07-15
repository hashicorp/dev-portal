import { LearnProductData } from 'types/products'
import TutorialView from 'views/tutorial-view'
import { generateStaticFunctions } from 'views/tutorial-view/server'
// product data
import nomadData from 'data/nomad.json'

const { getStaticPaths, getStaticProps } = generateStaticFunctions(
	nomadData as LearnProductData
)

export { getStaticPaths, getStaticProps }
export default TutorialView
