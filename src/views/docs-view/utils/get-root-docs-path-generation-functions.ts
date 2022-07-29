import { getStaticGenerationFunctions as getStaticGenerationFunctionsBase } from 'views/docs-view/server'
import { ProductData, ProductSlug, RootDocsPath } from 'types/products'
import {
	GetStaticPaths,
	GetStaticPathsResult,
	GetStaticProps,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next'
import { cachedGetProductData } from 'lib/get-product-data'
import { removeIndexPath } from 'lib/remove-index-path'

/**
 * Generates static functions for use in a
 * `pages/<productSlug>/<rootDocsPath>/[...page].tsx` DocsView page file.
 */
export function getStaticGenFunctions(
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
	return {
		getStaticPaths: async () => {
			return await getStaticPaths(productData, rootDocsPath)
		},
		getStaticProps: async ({ params }) => {
			return await getStaticProps({ params }, productData, rootDocsPath)
		},
	}
}

/**
 *
 * getStaticPaths
 *
 */

/**
 * Get static paths for `<rootDocsPath>/[...page]`
 */
async function getStaticPaths(
	productData: ProductData,
	rootDocsPath: RootDocsPath
): Promise<GetStaticPathsResult> {
	// Pull the necessary properties off the rootDocsPath config
	const {
		path: basePath,
		name: baseName,
		productSlugForLoader,
		navDataPrefix,
	} = rootDocsPath
	// Generate the base-path-specific getStaticPaths
	const { getStaticPaths: generatedGetStaticPaths } =
		getStaticGenerationFunctionsBase({
			product: productData,
			productSlugForLoader,
			basePath,
			baseName,
			navDataPrefix,
		})
	// Grab the raw paths using the generated getStaticPaths
	const { paths: rawPaths, ...restStaticPaths } = await generatedGetStaticPaths(
		{}
	)
	/**
	 * If applicable,  filter out the path used for "custom" docs landing pages
	 * (currently this is only "docs", approach to custom docs landing pages
	 * may change this in the future.)
	 */
	const hasCustomLandingPage = rootDocsPath.path == 'docs'
	const paths = hasCustomLandingPage ? removeIndexPath(rawPaths) : rawPaths
	// Return all generated paths
	return { paths, ...restStaticPaths }
}

/**
 *
 * getStaticProps
 *
 */

/**
 * Get static props for an [...allDocs] page
 */
async function getStaticProps(
	{ params }: GetStaticPropsContext,
	productData: ProductData,
	rootDocsPath: RootDocsPath
): Promise<GetStaticPropsResult<Record<string, unknown>>> {
	// Get the configured getStaticProps for the target rootDocsPath
	const { getStaticProps: generatedGetStaticProps } =
		getStaticGenerationFunctionsBase({
			baseName: rootDocsPath.name,
			basePath: rootDocsPath.path,
			navDataPrefix: rootDocsPath.navDataPrefix,
			product: productData,
			productSlugForLoader: rootDocsPath.productSlugForLoader,
		})
	// Note that the context { params } are constructed here, not passed directly.
	return await generatedGetStaticProps({ params })
}
