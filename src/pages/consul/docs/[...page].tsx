import { GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ProductData } from 'types/products'
import DocsView from 'views/docs-view'
// product data
import consulData from 'data/consul.json'
// server
import { getStaticGenerationFunctions } from 'views/docs-view/server'
import { removeIndexPath } from 'lib/remove-index-path'

const basePath = 'docs'
const baseName = 'Docs'
const product = consulData as ProductData

const { getStaticPaths: generatedGetStaticPaths, getStaticProps } =
	getStaticGenerationFunctions({
		product,
		basePath,
		baseName,
	})

/**
 * Wrapper for `generatedGetStaticPaths`. It handles removing the index path
 * from the `paths` array returned by `generatedGetStaticPaths`.
 */
async function getStaticPaths(
	context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
	const { paths, ...restReturn } = await generatedGetStaticPaths(context)
	const pathsWithoutIndex = removeIndexPath(paths)
	return { ...restReturn, paths: pathsWithoutIndex }
}

export { getStaticPaths, getStaticProps }
export default DocsView
