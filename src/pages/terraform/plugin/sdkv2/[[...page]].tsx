import DocsView from 'views/docs-view'
import { getRootDocsPathGenerationFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'

const { getStaticPaths, getStaticProps } = getRootDocsPathGenerationFunctions(
	'terraform',
	'plugin/sdkv2',
	{ projectName: 'Plugin SDK' }
)

export { getStaticProps, getStaticPaths }
export default DocsView
