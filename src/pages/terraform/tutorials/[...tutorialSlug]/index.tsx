import { LearnProductData } from 'types/products'
import TutorialView from 'views/tutorial-view'
import { generateStaticFunctions } from 'views/tutorial-view/server'
// product data
import terraformData from 'data/terraform.json'

const { getStaticPaths, getStaticProps } = generateStaticFunctions(
	terraformData as LearnProductData
)

export { getStaticPaths, getStaticProps }
export default TutorialView
