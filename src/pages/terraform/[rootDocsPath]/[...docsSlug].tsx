import { getDocsSlugStaticGenFunctions } from 'views/docs-view/utils/all-docs-server'
import DocsView from 'views/docs-view'

const { getStaticPaths, getStaticProps } =
	getDocsSlugStaticGenFunctions('terraform')

export { getStaticProps, getStaticPaths }
export default DocsView
