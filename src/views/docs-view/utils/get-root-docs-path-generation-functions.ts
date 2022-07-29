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
	const paths = hasCustomLandingPage ? removeLandingPath(rawPaths) : rawPaths
	// Return all generated paths
	return { paths, ...restStaticPaths }
}

/**
 * Given an array of path entries,
 * Return a filtered array of path entries, removing the entries where
 * the params are empty.
 *
 * This is useful for [...page] files being used with out docs-page content
 * loader, where we get the landing page params back from our loader,
 * but we don't actually want to use them.
 */
export function removeLandingPath(paths, paramId = 'page') {
	// Filter out entries that have empty [...docsSlug] params
	return paths.filter((entry) => {
		/**
		 * Parse the full path from the entry.
		 * Note: We most often expect the last else case, but we have to handle
		 * other cases to account for all possible types.
		 */
		let entryPath
		if (typeof entry == 'string') {
			entryPath = entry
		} else if (typeof entry.params[paramId] == 'string') {
			entryPath = entry.params[paramId]
		} else {
			entryPath = entry.params[paramId].join('/')
		}
		/**
		 * Filter out entries where the entryPath is empty
		 */
		return entryPath !== ''
	})
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
