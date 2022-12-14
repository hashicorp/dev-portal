import { getPathsFromNavData } from '@hashicorp/react-docs-page/server'
import path from 'path'
import { ProductData, RootDocsPath } from 'types/products'
import fetchGithubFile from 'lib/fetch-github-file'
import { cachedGetProductData } from 'lib/get-product-data'
import { productSlugs } from 'lib/products'

const REPO = 'waypoint'
const BASE_PATH = 'docs'
const BRANCH_TO_RUN_FOR = 'docs/amb.migrate-link-formats'

const normalizeLoaderSlug = (loaderSlug) => {
	return productSlugs.find((productSlug) => {
		if (loaderSlug === productSlug) {
			return true
		}

		const productData = cachedGetProductData(productSlug)
		return !!productData.rootDocsPaths.find((rootDocsPath) => {
			return loaderSlug === rootDocsPath.productSlugForLoader
		})
	})
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
	branchName,
	filePath,
}: {
	branchName?: string
	filePath: string
}) => {
	const fileContents = await fetchGithubFile({
		owner: 'hashicorp',
		repo: REPO,
		path: filePath,
		ref: branchName,
	})
	return JSON.parse(fileContents)
}

export const getAllPagePaths = async ({ basePath, branchName, repoName }) => {
	const productSlug = normalizeLoaderSlug(repoName)
	const productData = cachedGetProductData(productSlug)
	const { navDataPrefix } = getRelevantFileNamePrefixes(repoName)

	const navDataFileName = getNavDataFileNameForBasePath(basePath, productData)
	const navDataFilePath = path.join(navDataPrefix, navDataFileName)
	const navData = await fetchNavData({ branchName, filePath: navDataFilePath })

	const pagePathObjects = getPathsFromNavData(navData)
	const allPagePaths = pagePathObjects.map((pagePathObject) => {
		const pagePath = pagePathObject.params.page.join('/')
		return [productSlug, basePath, pagePath].join('/')
	})

	return allPagePaths
}
