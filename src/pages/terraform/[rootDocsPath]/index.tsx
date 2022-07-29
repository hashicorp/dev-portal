import { getRootDocsPathStaticGenFunctions } from 'views/docs-view/utils/all-docs-server'
import DocsView from 'views/docs-view'

const { getStaticPaths, getStaticProps } =
	getRootDocsPathStaticGenFunctions('terraform')

export { getStaticPaths, getStaticProps }
export default DocsView
