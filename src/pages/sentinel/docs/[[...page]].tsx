import sentinelData from 'data/sentinel.json'
import { ProductData } from 'types/products'
import remarkSentinel from 'lib/remark-sentinel'
import { getStaticGenerationFunctions } from 'views/docs-view/server'
import DocsView from 'views/docs-view'

const basePath = 'docs'
const basePathForLoader = 'sentinel'
const baseName = 'Docs'
const product = sentinelData as ProductData

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	product,
	basePath,
	basePathForLoader,
	baseName,
	additionalRemarkPlugins: [remarkSentinel],
})

export { getStaticPaths, getStaticProps }
export default DocsView
