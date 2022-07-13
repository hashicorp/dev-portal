import { LearnProductData } from 'types/products'
import TutorialView from 'views/tutorial-view'
import { generateStaticFunctions } from 'views/tutorial-view/server'
// product data
import waypointData from 'data/waypoint.json'

const { getStaticPaths, getStaticProps } = generateStaticFunctions(
	waypointData as LearnProductData
)

export { getStaticPaths, getStaticProps }
export default TutorialView
