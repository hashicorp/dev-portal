import TutorialView from 'views/tutorial-view'
import { generateStaticFunctions } from 'views/tutorial-view/server'

const { getStaticPaths, getStaticProps } = generateStaticFunctions()

export { getStaticPaths, getStaticProps }
export default TutorialView
