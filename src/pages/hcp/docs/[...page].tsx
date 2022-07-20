import { GetStaticPathsContext, GetStaticPathsResult } from 'next'
import hcpData from 'data/hcp.json'
import { ProductData } from 'types/products'
import {
	generateGetStaticProps,
	generateGetStaticPaths,
} from 'views/docs-view/server'
import DocsView from 'views/docs-view'
import { cachedGetProductData } from 'lib/get-product-data'

const basePath = 'docs'
const baseName = 'Docs'
const product = hcpData as ProductData

/**
 * Wrapper for `generatedGetStaticPaths`. It handles removing the index path
 * from the `paths` array returned by `generatedGetStaticPaths`.
 */
async function getStaticPaths(
	context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
	const generatedGetStaticPaths = generateGetStaticPaths({
		product,
		productSlugForLoader: 'cloud.hashicorp.com',
		basePath,
		baseName,
	})
	const { paths, ...restReturn } = await generatedGetStaticPaths(context)
	// eslint-disable-next-line @typescript-eslint/typedef
	const pathsWithoutIndex = paths.filter((pathEntry) => {
		const isIndexPath =
			typeof pathEntry == 'string'
				? pathEntry == ''
				: pathEntry.params.page.length == 0
		return !isIndexPath
	})
	return { ...restReturn, paths: pathsWithoutIndex }
}

const getStaticProps = async (context) => {
	const productData = cachedGetProductData('hcp')
	const rootDocsPath = productData.rootDocsPaths.find(({ path }) => {
		return path === basePath
	})
	const generatedGetStaticProps = generateGetStaticProps({
		product: productData,
		basePath: rootDocsPath.path,
		baseName: rootDocsPath.shortName || rootDocsPath.name,
		productSlugForLoader: 'cloud.hashicorp.com',
	})
	const generatedProps = await generatedGetStaticProps(context)
	return generatedProps
}

export { getStaticPaths, getStaticProps }
export default DocsView
