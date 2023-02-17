/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	ALL_PAGE_PATHS_OUTPUT_FILE_PATH,
	ALL_PAGE_PATHS_OUTPUT_FOLDER,
} from './constants'
import { getAllPagePathsForBasePathAndRepo } from './helpers/get-all-page-paths-for-base-path-and-repo'
import { normalizeRemoteLoaderSlug } from './helpers/normalize-remote-loader-slug'
import { RootDocsPath } from 'types/products'

const main = async () => {
	// Require the REPO environment variable
	const { REPO } = process.env
	if (!REPO) {
		throw new Error('The REPO environment variable is required')
	}

	// Find the root docs paths that need nav-data fetched
	const productData = cachedGetProductData(normalizeRemoteLoaderSlug(REPO))
	const relevantRootDocsPaths = productData.rootDocsPaths.filter(
		(rootDocsPath: RootDocsPath) => {
			if (REPO === productData.slug) {
				return !rootDocsPath.hasOwnProperty('productSlugForLoader')
			} else {
				return rootDocsPath.productSlugForLoader === REPO
			}
		}
	)

	// Fetch the nav data for each relevant root docs path
	const navDataResults = await Promise.all(
		relevantRootDocsPaths.map((rootDocsPath: RootDocsPath) => {
			return getAllPagePathsForBasePathAndRepo({
				basePath: rootDocsPath.path,
				repo: REPO,
			})
		})
	)

	// Build up `allPathsByBasePath` object
	const allPathsByBasePath = {}
	navDataResults.forEach((result: string[], index: number) => {
		const basePath = relevantRootDocsPaths[index].path
		const uniqueArray = Array.from(new Set(result))
		allPathsByBasePath[basePath] = uniqueArray
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
