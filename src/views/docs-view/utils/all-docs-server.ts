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
	const paths = removeLandingPaths(allPaths)
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
	const subpaths = configureRootDocsPathParams(rawPaths, basePath)
	// Return the subpaths
	return subpaths
}

/**
 * Given an array of path entries, and a specific rootDocsPath prefix,
 * Return an array of { rootDocsPath, docsSlug } path entries,
 * where docsSlug is the `page` params from the provided paths entries.
 *
 * This enables path entries fetched using our standard docs-page loader
 * to be used with a `[rootDocsPath]/[...docsSlug].tsx` page file.
 */
export function configureRootDocsPathParams(
	paths: GetStaticPathsResult['paths'],
	rootDocsPath: string
): GetStaticPathsResult['paths'] {
	return paths.reduce((acc, entry) => {
		/**
		 * We leave string entries untouched, as it's unclear how we'd handle them.
		 * This is mostly a type guard of sorts.
		 */
		if (typeof entry === 'string') {
			return acc
		}
		/**
		 * params.page is intended for use with a <rootDocsPath>/[[...page]].tsx file.
		 * We prefix these params with the [rootDocsPath] setup we're using.
		 */
		const { page } = entry.params
		const pageParams = typeof page == 'string' ? [page] : page
		return acc.concat([
			{
				...entry,
				params: {
					rootDocsPath: rootDocsPath,
					docsSlug: pageParams,
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
 *
 * TODO: remove this function once approach is finalized,
 * may not be needed.
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
 * Given an array of path entries from the `[rootDocsPath]/[...docsSlug].tsx`
 * route, remove entries where the `[...docsSlug]` resolves to an empty path.
 *
 * This avoids conflicts between the following getStaticPaths:
 * - `[rootDocsPath]/[...docsSlug].tsx` (where this filter function is used)
 * - `[rootDocsPath]/index.tsx` (will render landing paths)
 */
export function removeLandingPaths(paths) {
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
		} else if (typeof entry.params.docsSlug == 'string') {
			entryPath = entry.params.docsSlug
		} else {
			entryPath = entry.params.docsSlug.join('/')
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
	productData: ProductData
): Promise<GetStaticPropsResult<Record<string, unknown>>> {
	/**
	 * Determine which basePath we're working with from incoming params,
	 * and determine the pageParams within that basePath.
	 */
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
	/**
	 * Determine which basePath we're working with, from incoming params
	 *
	 * Note: When used with the `[rootDocsPath]/index.tsx` page file,
	 * params.docsSlug will be undefined, so we fall back to an empty array.
	 */
	const targetBasePath = params.rootDocsPath
	const [maybeTargetBasePath, ...restParams] = params.docsSlug || []
	let basePath
	let pageParams
	/**
	 * Note that some basePaths are nested, such as "cloud-docs/agents".
	 * For these paths, we need to massage params even further to get the
	 * pageParams we can pass to the usual docs getStaticProps loader.
	 */
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
 * Generates static functions for use in a
 * `[rootDocsPath]/[...docsSlug].tsx` DocsView page file.
 */
export function getDocsSlugStaticGenFunctions(productSlug: ProductSlug): {
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

/**
 * Generates static functions for use in a
 * `[rootDocsPath]/index.tsx` DocsView page file.
 */
export function getRootDocsPathStaticGenFunctions(productSlug: ProductSlug): {
	getStaticPaths: GetStaticPaths
	getStaticProps: GetStaticProps
} {
	const productData = cachedGetProductData(productSlug)
	return {
		getStaticPaths: async () => {
			/**
			 * Grab all rootDocsPaths form product data,
			 * except those with custom landing pages
			 */
			const paths = productData.rootDocsPaths
				.filter((rootDocsPath) => !rootDocsPath.hasCustomLandingPage)
				.map((rootDocsPath) => {
					return {
						params: {
							rootDocsPath: rootDocsPath.path,
						},
					}
				})
			/**
			 * Return the paths. Note that { fallback: false } is necessary here,
			 * as we need to ensure we do not try to fallback for routes such
			 * as /terraform/install, /terraform/tutorials, etc etc.
			 * We want to restrict paths to rootDocsPaths only.
			 */
			return { paths, fallback: false }
		},
		getStaticProps: async ({ params }) => {
			const staticProps = await getStaticProps({ params }, productData)
			/**
			 * Note that { revalidate: false } is necessary here,
			 * as we need to ensure we do not try to revalidate routes such
			 * as /terraform/install, /terraform/tutorials, etc etc.
			 */
			return { ...staticProps, revalidate: false }
		},
	}
}
