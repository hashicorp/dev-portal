import { getStaticGenerationFunctions as getStaticGenerationFunctionsBase } from 'views/docs-view/server'
import { ProductData } from 'types/products'

/**
 * TODO: document this function
 */
function prefixSubpaths(rawPaths, basePath) {
	return rawPaths.reduce((acc, entry) => {
		//
		if (typeof entry === 'string') {
			return acc
		}
		//
		const { page } = entry.params
		const pageParams = typeof page == 'string' ? [page] : page
		//
		acc.push({
			params: {
				// TODO: basePath might have a slash in it.
				// TODO: this might not matter, not sure... ... but might be nice to
				// TODO: explicitly make sure that each param entry string
				// TODO: does NOT have slashes in it?
				allDocs: [basePath, ...pageParams],
			},
			locale: entry.locale,
		})
		//
		return acc
	}, [])
}

/**
 * TODO: document this function
 */
function removeCustomLandingPaths(paths, rootDocsPaths) {
	// Set up an array of basePaths with "custom" docs landing pages
	const customLandingPaths = rootDocsPaths
		// .filter((r) => r.hasCustomLanding)
		.filter((r) => r.path == 'docs')
		.map((r) => r.path)
	//
	return paths.filter((entry) => {
		const params = entry.params.allDocs
		const fullPath = params.join('/')
		const isCustomLandingPath = customLandingPaths.reduce(
			(acc, landingPath) => {
				return acc || fullPath == landingPath || fullPath == `${landingPath}/`
			},
			false
		)
		//
		return !isCustomLandingPath
	})
}

async function getSubpaths(rootDocsPath, productData) {
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
	// Note that the context argument is not used, but must be provided.
	const { paths: rawPaths } = await generatedGetStaticPaths({})
	// Map the rawPaths to prefix them with the current docs subpath
	const subpaths = prefixSubpaths(rawPaths, basePath)
	// Return the subpaths
	return subpaths
}
/**
 * TODO: document this function
 */
async function getStaticPaths({ productData }: { productData: ProductData }) {
	// Gather together all paths from all rootDocsPaths
	const { rootDocsPaths } = productData
	let allPaths = []
	for (let i = 0; i < rootDocsPaths.length; i++) {
		const subpaths = await getSubpaths(rootDocsPaths[i], productData)
		allPaths = allPaths.concat(subpaths)
	}
	// Filter out paths used for "custom" docs landing pages
	const paths = removeCustomLandingPaths(allPaths, rootDocsPaths)
	// Return all generated paths
	return { paths, fallback: 'blocking' }
}

/**
 * TODO: document this function
 */
function parseRootDocsPath(params, rootDocsPaths) {
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
 * TODO: document this function
 */
async function getStaticProps({ params, productData }: $TSFixMe) {
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
 * TODO: document this function
 */
export function getStaticGenerationFunctions({
	productData,
}: {
	productData: ProductData
}) {
	return {
		getStaticPaths: async () => {
			return await getStaticPaths({
				productData,
			})
		},
		getStaticProps: async ({ params }: { params: $TSFixMe }) => {
			return await getStaticProps({
				params,
				productData,
			})
		},
	}
}
