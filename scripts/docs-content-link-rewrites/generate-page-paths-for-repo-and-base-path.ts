import fs from 'fs'
import { cachedGetProductData } from 'lib/get-product-data'
import { getAllPagePaths } from './get-all-page-paths'
import {
	ALL_PAGE_PATHS_OUTPUT_FILE_PATH,
	ALL_PAGE_PATHS_OUTPUT_FOLDER,
} from './constants'
import { normalizeRemoteLoaderSlug } from './helpers/normalize-remote-loader-slug'

const main = async () => {
	// Require the REPO_NAME environment variable
	const { REPO_NAME } = process.env
	if (!REPO_NAME) {
		throw new Error('The REPO_NAME environment variable is required')
	}

	// Find the root docs paths that need nav-data fetched
	const productData = cachedGetProductData(normalizeRemoteLoaderSlug(REPO_NAME))
	const relevantRootDocsPaths = productData.rootDocsPaths.filter(
		(rootDocsPath) => {
			if (REPO_NAME === productData.slug) {
				return !rootDocsPath.hasOwnProperty('productSlugForLoader')
			} else {
				return rootDocsPath.productSlugForLoader === REPO_NAME
			}
		}
	)

	// Build up `allPathsByBasePath` object
	const allPathsByBasePath = {}
	const navDataResults = await Promise.all(
		relevantRootDocsPaths.map(({ path }) => {
			return getAllPagePaths({ basePath: path, repoName: REPO_NAME })
		})
	)
	navDataResults.forEach((result, index) => {
		const basePath = relevantRootDocsPaths[index].path
		allPathsByBasePath[basePath] = result
	})

	// Create the output folder if it doesn't exist
	const outputFolderExists = fs.existsSync(ALL_PAGE_PATHS_OUTPUT_FOLDER)
	if (!outputFolderExists) {
		fs.mkdirSync(ALL_PAGE_PATHS_OUTPUT_FOLDER)
	}

	// Write the output to a file
	fs.writeFileSync(
		ALL_PAGE_PATHS_OUTPUT_FILE_PATH,
		JSON.stringify(allPathsByBasePath, null, 2),
		'utf-8'
	)
}

main()
