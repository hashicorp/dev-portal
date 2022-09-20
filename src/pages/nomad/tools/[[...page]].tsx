import DocsView from 'views/docs-view'
import { getRootDocsPathGenerationFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'

const { getStaticPaths, getStaticProps } = getRootDocsPathGenerationFunctions(
	'nomad',
	'tools',
	{ hideVersionSelector: true }
)

export { getStaticProps, getStaticPaths }
export default DocsView
