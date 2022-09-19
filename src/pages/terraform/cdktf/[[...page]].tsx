import DocsView from 'views/docs-view'
import { getRootDocsPathGenerationFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'

const { getStaticPaths, getStaticProps } = getRootDocsPathGenerationFunctions(
	'terraform',
	'cdktf',
	{ projectName: 'CDK For Terraform' }
)

export { getStaticProps, getStaticPaths }
export default DocsView
