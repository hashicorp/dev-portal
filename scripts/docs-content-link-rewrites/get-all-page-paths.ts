import path from 'path'
import { ProductData, RootDocsPath } from 'types/products'
import fetchGithubFile from 'lib/fetch-github-file'
import { cachedGetProductData } from 'lib/get-product-data'
import { normalizeRemoteLoaderSlug } from './helpers/normalize-remote-loader-slug'

/**
 * @NOTE copied from:
 * node_modules/@hashicorp/react-docs-page/server/get-paths-from-nav-data.ts
 */
function getPathArraysFromNodes(navNodes: $TSFixMe): string[][] {
	const slugs: string[][] = navNodes.reduce((acc, navNode) => {
		// Individual items have a path, these should be added
		if ('path' in navNode) {
			return acc.concat([navNode.path.split('/')])
		}
		// Category items have child routes, these should all be added
		if ('routes' in navNode) {
			return acc.concat(getPathArraysFromNodes(navNode.routes))
		}
		// All other node types (dividers, external links) can be ignored
		return acc
	}, [] as string[][])
	return slugs
}

/**
 * @NOTE copied from:
 * node_modules/@hashicorp/react-docs-page/server/get-paths-from-nav-data.ts
 */
function getPathsFromNavData(
	navDataResolved: $TSFixMe,
	paramId: string = 'page'
): {
	params: Record<string, string[]>
}[] {
	//  Transform navigation data into path arrays
	const pagePathArrays = getPathArraysFromNodes(navDataResolved)
	// Ensure we include an empty array for the "/" index page path
	// (may be included in nav-data, eg for Terraform, or may not, eg for all other sites)
	const hasIndexPage = pagePathArrays.filter((p) => p.length == 0).length > 0
	if (!hasIndexPage) {
		pagePathArrays.unshift([])
	}
	// Return the array of all page paths
	const paths = pagePathArrays.map((p) => ({ params: { [paramId]: p } }))
	return paths
}

/**
 * Given a hashicorp repository name, return an object with two properties:
 *  - mdxPrefix: the filename prefix for MDX files
 *  - navDataPrefix: the filename prefix for nav data JSON files
 */
const getRelevantFileNamePrefixes = (repo: string) => {
	// The default values that most repos use
	let mdxPrefix = 'website/content'
	let navDataPrefix = 'website/data'

	// HCP and Terraform docs content repos use slightly different values
	if (repo === 'cloud.hashicorp.com') {
		mdxPrefix = 'content'
		navDataPrefix = 'content'
	} else if (repo.startsWith('terraform') || repo.startsWith('ptfe-releases')) {
		mdxPrefix = 'website/docs'
	}

	// Return the values in an object
	return { mdxPrefix, navDataPrefix }
}

const getNavDataFileNameForBasePath = (
	basePath: string,
	productData: ProductData
) => {
	const matchingRootDocsPath = productData.rootDocsPaths.find(
		(rootDocsPath: RootDocsPath) => {
			return rootDocsPath.path === basePath
		}
	)
	const fileNamePrefix =
		matchingRootDocsPath.navDataPrefix ?? matchingRootDocsPath.path
	return `${fileNamePrefix}-nav-data.json`
}

const fetchNavData = async ({
	filePath,
	repoName,
}: {
	filePath: string
	repoName: string
}) => {
	const fileContents = await fetchGithubFile({
		owner: 'hashicorp',
		repo: repoName,
		path: filePath,
	})
	return JSON.parse(fileContents)
}

export const getAllPagePaths = async ({ basePath, repoName }) => {
	const productSlug = normalizeRemoteLoaderSlug(repoName)
	const productData = cachedGetProductData(productSlug)
	const { navDataPrefix } = getRelevantFileNamePrefixes(repoName)

	const navDataFileName = getNavDataFileNameForBasePath(basePath, productData)
	const navDataFilePath = path.join(navDataPrefix, navDataFileName)
	const navData = await fetchNavData({
		filePath: navDataFilePath,
		repoName,
	})

	const pagePathObjects = getPathsFromNavData(navData)
	const allPagePaths = pagePathObjects.map((pagePathObject) => {
		const pagePath = pagePathObject.params.page.join('/')
		return [productSlug, basePath, pagePath].join('/')
	})

	return allPagePaths
}
