import DocsView from 'views/docs-view'
import { getStaticGenFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'

const { getStaticPaths, getStaticProps } = getStaticGenFunctions(
	'terraform',
	'cloud-docs'
)

export { getStaticProps, getStaticPaths }
export default DocsView
