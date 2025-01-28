/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { cachedGetProductData } from 'lib/get-product-data'
import { normalizeRemoteLoaderSlug } from './normalize-remote-loader-slug'
import { getMdxAndNavDataDirectoriesForRepo } from './get-mdx-and-nav-data-directories-for-repo'
import { fetchNavDataForBasePathAndRepo } from './fetch-nav-data-for-repo-and-base-path'
import { getNavDataFileNameForBasePath } from './get-nav-data-file-name-for-base-path'
import { getPathsFromNavData } from './get-paths-from-nav-data'

const getAllPagePathsForBasePathAndRepo = async ({
	basePath,
	repo,
}: {
	basePath: string
	repo: string
}) => {
	try {
		const productSlug = normalizeRemoteLoaderSlug(repo)
		const productData = cachedGetProductData(productSlug)

		const { navDataPrefix } = getMdxAndNavDataDirectoriesForRepo(repo)
		const navDataFileName = getNavDataFileNameForBasePath({
			basePath,
			productData,
		})
		const navDataFilePath = path.join(navDataPrefix, navDataFileName)
		const navData = await fetchNavDataForBasePathAndRepo({
			filePath: navDataFilePath,
			repo,
		})

		const pagePathObjects = getPathsFromNavData(navData)
		const allPagePaths = pagePathObjects.map(
			(pagePathObject: { params: Record<string, string[]> }) => {
				const pagePath = pagePathObject.params.page.join('/')
				return [productSlug, basePath, pagePath].join('/')
			}
		)

		return allPagePaths
	} catch (e) {
		console.warn(e)
		return []
	}
}

export { getAllPagePathsForBasePathAndRepo }
