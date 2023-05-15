import pageContent from 'content/tutorials-landing.json'
import TutorialsLandingView from 'views/tutorials-landing'

const getStaticProps = async () => {
	return {
		props: {
			pageContent,
		},
	}
}

export { getStaticProps }
export default TutorialsLandingView
