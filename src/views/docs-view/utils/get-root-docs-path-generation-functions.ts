import { getStaticGenerationFunctions } from 'views/docs-view/server'
import { ProductSlug } from 'types/products'
import { GetStaticPaths, GetStaticProps } from 'next'
import { cachedGetProductData } from 'lib/get-product-data'
import { removeIndexPath } from 'lib/remove-index-path'

/**
 * Generates static functions for use in a
 * `pages/<productSlug>/<rootDocsPath>/[...page].tsx` DocsView page file.
 */
export function getRootDocsPathGenerationFunctions(
	productSlug: ProductSlug,
	targetRootDocsPath: string
): {
	getStaticPaths: GetStaticPaths
	getStaticProps: GetStaticProps
} {
	const productData = cachedGetProductData(productSlug)
	const rootDocsPath = productData.rootDocsPaths.find((rootDocsPath) => {
		return rootDocsPath.path == targetRootDocsPath
	})
	const staticFunctionConfig = {
		baseName: rootDocsPath.name,
		basePath: rootDocsPath.path,
		navDataPrefix: rootDocsPath.navDataPrefix,
		product: productData,
		productSlugForLoader: rootDocsPath.productSlugForLoader,
		mainBranch: rootDocsPath.mainBranch,
	}
	return {
		getStaticPaths: async (context) => {
			// Generate getStaticPaths for this rootDocsPath
			const { getStaticPaths } =
				getStaticGenerationFunctions(staticFunctionConfig)
			// Grab the raw paths using the generated getStaticPaths
			const { paths: rawPaths, ...restStaticPathsResult } =
				await getStaticPaths(context)
			/**
			 * If applicable,  filter out the path used for "custom" docs landing pages
			 * (currently this is only "docs", approach to custom docs landing pages
			 * may change this in the future.)
			 */
			const hasCustomLandingPage = rootDocsPath.path == 'docs'
			const paths = hasCustomLandingPage ? removeIndexPath(rawPaths) : rawPaths
			// Return all generated paths
			return { paths, ...restStaticPathsResult }
		},
		getStaticProps: async (context) => {
			// Generate getStaticPaths for this rootDocsPath
			const { getStaticProps } =
				getStaticGenerationFunctions(staticFunctionConfig)
			return await getStaticProps(context)
		},
	}
}
