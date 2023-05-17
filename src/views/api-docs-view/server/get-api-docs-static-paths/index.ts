/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import { isDeployPreview } from 'lib/env-checks'
// Local
import { findLatestStableVersion } from '../../utils'
import { fetchApiDocsPaths } from './fetch-api-docs-paths'
// Types
import type { GetStaticPathsResult } from 'next'
import type { ApiDocsVersionData, ApiDocsParams } from '../../types'
import type { ProductSlug } from 'types/products'

/**
 * Gets static paths for versioned API docs views.
 *
 * Note that only the latest version of API docs will have static paths.
 * We use `fallback`: `blocking` to allow past versions of API docs
 * to be rendered on demand.
 *
 * Note: this function does _not_ handle loading OpenAPI `.json` spec files
 * from local content repo previews, as used for Boundary and Waypoint API docs.
 * In the future, if we're at the latest version URL and `isDeployPreview`
 * from `lib/env-checks` return `true`, we could load the schema a local
 * file instead in order to better support content repo previews.
 */
export async function getApiDocsStaticPaths(
	productSlug: ProductSlug,
	versionData: ApiDocsVersionData[]
): Promise<GetStaticPathsResult<ApiDocsParams>> {
	/**
	 * Determine if we want to skip building static content.
	 *
	 * This applies only to deploy previews from content repositories.
	 * We want to skip static content if we're building a content deploy preview,
	 * and that content deploy preview is not for the relevant product.
	 */
	const skipStaticBuild = isDeployPreview() && !isDeployPreview(productSlug)
	if (skipStaticBuild) {
		return { paths: [], fallback: 'blocking' }
	}

	/**
	 * Determine which static paths to build, based on the incoming versionData.
	 *
	 * We want to build static paths for the latest version of the API docs only.
	 * For the latest version, paths format is `(page)/<service-id>`.
	 * For versioned URLs, path format is `(page)/<version-id>/<service-id>`.
	 */
	// Grab the latest version only.
	const latestStableVersion = findLatestStableVersion(versionData)
	// If we can't match a latest version, don't statically render anything.
	if (!latestStableVersion) {
		return { paths: [], fallback: 'blocking' }
	}
	// Parse the path parts for all API docs pages we need to statically render.
	const apiDocsPaths = await fetchApiDocsPaths(latestStableVersion.targetFile)

	/**
	 * Format and return static paths. Note we set fallback 'blocking', rather
	 * than 404 for non-static paths, as there may be previous versions to render.
	 */
	const staticPathObjects = apiDocsPaths.map((pathParts: string[]) => {
		return { params: { page: pathParts } }
	})
	return { paths: staticPathObjects, fallback: 'blocking' }
}
