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
 *
 * getStaticPaths
 *
 */

/**
 * Get static paths for the [...allDocs] page.
 */
async function getStaticPaths(
	productData: ProductData
): Promise<GetStaticPathsResult> {
	// Gather together all paths from all rootDocsPaths
	const { rootDocsPaths } = productData
	let allPaths = []
	for (let i = 0; i < rootDocsPaths.length; i++) {
		const subpaths = await getSubpaths(rootDocsPaths[i], productData)
		allPaths = allPaths.concat(subpaths)
	}
	// Filter out paths used for "custom" docs landing pages
	const customLandingPaths = rootDocsPaths
		.filter((rootDocsPath) => rootDocsPath.hasCustomLandingPage)
		.map((rootDocsPath) => rootDocsPath.path)
	const paths = removeCustomLandingPaths(allPaths, customLandingPaths)
	// Return all generated paths
	return { paths, fallback: 'blocking' }
}

/**
 * Given a specific rootDocsPath, and corresponding ProductData,
 * Return an array of `paths` entries for the rootDocsPath loaded from our
 * content API, prefixed with the path of the provided rootDocsPath.
 * These paths entries are specifically for use with [...allDocs].tsx
 * page files.
 *
 * The purpose of this function is to allow multiple rootDocsPaths to render
 * from the same page file. To achieve this, each path entry must be prefixed
 * with the correct baseP
 */
async function getSubpaths(
	rootDocsPath: RootDocsPath,
	productData: ProductData
): Promise<GetStaticPathsResult['paths']> {
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
	// Call the generated, base-path-specific getStaticPaths.
	// (Note that the context argument is not used, but must be provided)
	const { paths: rawPaths } = await generatedGetStaticPaths({})
	// Map the rawPaths to prefix them with the current docs subpath
	const subpaths = prefixAllDocsSubpaths(rawPaths, basePath)
	// Return the subpaths
	return subpaths
}

/**
 * Given an array of path entries, and a specific basePath prefix,
 * Return an array of path entries prefixed with the basePath string
 * under an "allDocs" param.
 *
 * This enables path entries to be used with an [...allDocs].tsx page file.
 */
export function prefixAllDocsSubpaths(
	paths: GetStaticPathsResult['paths'],
	basePath: string
): GetStaticPathsResult['paths'] {
	return paths.reduce((acc, entry) => {
		// We leave string entries untouched, as it's unclear how we'd handle them
		if (typeof entry === 'string') {
			return acc
		}
		// params.page is intended for use with a <basePath>/[[...page]].tsx file.
		// We prefix these params with the basePath we're using.
		const { page } = entry.params
		const pageParams = typeof page == 'string' ? [page] : page
		return acc.concat([
			{
				...entry,
				params: {
					// Note: param name is hard-coded to allDocs.
					allDocs: [basePath, ...pageParams],
				},
			},
		])
	}, [])
}

/**
 * Given an array of path entries, and an array of rootDocsPaths,
 * Remove all path entries that match any rootDocsPaths marked as
 * having a separate custom landing page.
 *
 * This avoids conflicts between the [...allDocs] getStaticPaths,
 * and the [productSlug]/docs getStaticPaths.
 *
 * Note that this will most likely need adjustment once we finalize our
 * approach to custom docs path page files.
 */
export function removeCustomLandingPaths(
	paths: GetStaticPathsResult['paths'],
	customLandingPaths: string[]
): GetStaticPathsResult['paths'] {
	// Filter out entries that match any of the custom landing page paths
	return paths.filter((entry) => {
		/**
		 * Parse the full path from the entry.
		 * Note: We most often expect the last else case, but we have to handle
		 * other cases to account for all possible types.
		 */
		let entryPath
		if (typeof entry == 'string') {
			entryPath = entry
		} else if (typeof entry.params.allDocs == 'string') {
			entryPath = entry.params.allDocs
		} else {
			entryPath = entry.params.allDocs.join('/')
		}
		/**
		 * Filter out entries where the full path matches a known
		 * custom landing path.
		 */
		const isNotCustomLandingPath = customLandingPaths.every((landingPath) => {
			const isMatch = entryPath == landingPath || entryPath == `${landingPath}/`
			return !isMatch
		})
		return isNotCustomLandingPath
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
	productData: ProductData
): Promise<GetStaticPropsResult<Record<string, unknown>>> {
	// Determine which basePath we're working with from incoming params,
	// and determine the pageParams within that basePath
	const { rootDocsPath, pageParams } = parseRootDocsPath(
		params,
		productData.rootDocsPaths
	)
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
	return await generatedGetStaticProps({
		params: { page: pageParams },
	})
}

/**
 * Given params from [...allDocs] page getStaticProps context,
 * and an array of rootDocsPaths,
 * Return the rootDocsPath config that matches the provided params,
 * and return the pageParams to be passed to our content loader.
 *
 * This allows us to use our existing generateGetStaticFunctions,
 * configuring it with the matched `rootDocsPath`, and passing `pageParams`
 * which do _not_ include the matched `rootDocsPath`.
 */
export function parseRootDocsPath(params, rootDocsPaths) {
	// Determine which basePath we're working with, from incoming params
	const [targetBasePath, maybeTargetBasePath, ...restParams] = params.allDocs
	let basePath
	let pageParams
	// Note that some basePaths are nested, such as "cloud-docs/agents"
	// For these paths, we need to massage params even further to get the
	// pageParams we can pass to the usual docs getStaticProps loader
	const maybeNestedBasePath = [targetBasePath, maybeTargetBasePath].join('/')
	const allBasePaths = rootDocsPaths.map(({ path }) => path)
	const isNestedBasePath = allBasePaths.indexOf(maybeNestedBasePath) !== -1
	if (isNestedBasePath) {
		basePath = maybeNestedBasePath
		pageParams = [...restParams]
	} else {
		basePath = targetBasePath
		pageParams =
			typeof maybeTargetBasePath !== 'undefined'
				? [maybeTargetBasePath, ...restParams]
				: [...restParams]
	}
	// Get the configured getStaticProps for the target rootDocsPath
	const rootDocsPath = rootDocsPaths.find((entry) => entry.path == basePath)
	return { rootDocsPath, pageParams }
}

/**
 * Generates static functions for use in an [...allDocs].tsx DocsView page file.
 */
export function getStaticGenerationFunctions(productSlug: ProductSlug): {
	getStaticPaths: GetStaticPaths
	getStaticProps: GetStaticProps
} {
	const productData = cachedGetProductData(productSlug)
	return {
		getStaticPaths: async () => {
			return await getStaticPaths(productData)
		},
		getStaticProps: async ({ params }) => {
			return await getStaticProps({ params }, productData)
		},
	}
}
