import { GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ProductData } from 'types/products'
import DocsView from 'views/docs-view'
// product data
import nomadData from 'data/nomad.json'
// server
import {
	generateGetStaticPaths,
	generateGetStaticProps,
} from 'views/docs-view/server'
import { removeIndexPath } from 'lib/remove-index-path'

const basePath = 'plugins'
const baseName = 'Plugins'
const product = nomadData as ProductData

/**
 * Wrapper for `generatedGetStaticPaths`. It handles removing the index path
 * from the `paths` array returned by `generatedGetStaticPaths`.
 */
async function getStaticPaths(
	context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
	const generatedGetStaticPaths = generateGetStaticPaths({
		product,
		basePath,
		baseName,
	})
	const { paths, ...restReturn } = await generatedGetStaticPaths(context)
	const pathsWithoutIndex = removeIndexPath(paths)
	return { ...restReturn, paths: pathsWithoutIndex }
}

const getStaticProps = async (context) => {
	const generatedGetStaticProps = generateGetStaticProps({
		product,
		basePath,
		baseName,
	})
	const generatedProps = await generatedGetStaticProps(context)
	return generatedProps
}

export { getStaticPaths, getStaticProps }
export default DocsView
