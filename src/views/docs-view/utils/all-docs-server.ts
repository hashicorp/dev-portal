import { getStaticGenerationFunctions as getStaticGenerationFunctionsBase } from 'layouts/sidebar-sidecar/server'
import { ProductData } from 'types/products'

/**
 * TODO: document this function
 */
async function getSubpathStaticPaths({
	productData,
	basePath,
	baseName,
	productSlugForLoader,
	navDataPrefix,
}: {
	productData: ProductData
	basePath: string
	baseName: string
	productSlugForLoader: string
	navDataPrefix?: string
}) {
	// TODO: feels weird invoking this within getStaticPaths.
	// TODO: maybe there's another way?
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
	const paths = rawPaths.reduce((acc, entry) => {
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

	return paths
}

/**
 * TODO: document this function
 */
async function getStaticPathsInner({
	productData,
}: {
	productData: ProductData
}) {
	const { rootDocsPaths } = productData
	// Gather all paths from all possible subpaths
	let allPaths = []
	for (let i = 0; i < rootDocsPaths.length; i++) {
		const { path, name, productSlugForLoader, navDataPrefix } = rootDocsPaths[i]
		const subpathPaths = await getSubpathStaticPaths({
			basePath: path,
			baseName: name,
			productSlugForLoader,
			navDataPrefix,
			productData,
		})
		allPaths = allPaths.concat(subpathPaths)
	}
	// Set up an array of basePaths with "custom" docs landing pages
	const customLandingPaths = rootDocsPaths.filter((r) => r.hasCustomLanding)
	// Filter out paths used for "custom" docs landing pages

	const paths = allPaths.filter((entry) => {
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
	// Return all generated paths
	return { paths, fallback: 'blocking' }
}

/**
 * TODO: document this function
 */
async function getStaticPropsInner({ params, productData }: $TSFixMe) {
	const { rootDocsPaths } = productData
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
	// Get the config for the target basePath
	// TODO: guard against targetRootDocsPathConfig not being found
	const targetRootDocsPathConfig = rootDocsPaths.filter(({ path }) => {
		return path == basePath
	})[0]
	const { name, productSlugForLoader, navDataPrefix } = targetRootDocsPathConfig
	// Call getStaticProps using configuration for the target basePath
	// TODO: feels weird invoking this within getStaticPaths.
	// TODO: maybe there's another way?
	const { getStaticProps: generatedGetStaticProps } =
		getStaticGenerationFunctionsBase({
			product: productData,
			productSlugForLoader,
			basePath,
			baseName: name,
			navDataPrefix,
		})
	// Note that the context { params } are constructed here, not passed directly.
	const staticProps = await generatedGetStaticProps({
		params: { page: pageParams },
	})
	//
	// return staticProps
	return staticProps
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
			return await getStaticPathsInner({
				productData,
			})
		},
		getStaticProps: async ({ params }: { params: $TSFixMe }) => {
			return await getStaticPropsInner({
				params,
				productData,
			})
		},
	}
}
