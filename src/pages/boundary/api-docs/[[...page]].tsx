/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Shared
import { isDeployPreview } from 'lib/env-checks'
// View
import ApiDocsView from 'views/api-docs-view'
import {
	getApiDocsStaticProps,
	getApiDocsStaticPaths,
	ApiDocsParams,
} from 'views/api-docs-view/server'
// Types
import type { ApiDocsVersionData } from 'lib/api-docs/types'
import type { ApiDocsViewProps } from 'views/api-docs-view/types'
import type { GetStaticPaths, GetStaticProps } from 'next'

/**
 * The product slug is used to fetch product data for the layout.
 */
const PRODUCT_SLUG = 'boundary'

/**
 * The baseUrl is used to generate
 * breadcrumb links, sidebar nav levels, and version switcher links.
 */
const BASE_URL = '/boundary/api-docs'

/**
 * The path to read from when running local preview in the context
 * of the `hashicorp/boundary` repository.
 */
const TARGET_LOCAL_FILE = '../../internal/gen/controller.swagger.json'

/**
 * Version data is hard-coded for now. In the future, we could fetch
 * version data from elsewhere, as we do for `/hcp/api-docs/packer`.
 */
function getVersionData(): ApiDocsVersionData[] {
	const sourceFile = isDeployPreview(PRODUCT_SLUG)
		? TARGET_LOCAL_FILE
		: {
				owner: 'hashicorp',
				repo: 'boundary',
				path: 'internal/gen/controller.swagger.json',
				ref: 'stable-website',
		  }
	return [
		{
			/**
			 * Note this is a `versionId` placeholder. Since it isn't date-based,
			 * currently we won't render a dedicated versioned URL for it.
			 *
			 * In the future, we could support version formats other than date-based.
			 * That might better align with versioned API docs for Boundary.
			 */
			versionId: 'latest',
			sourceFile,
		},
	]
}

/**
 * Get static paths, using `versionData` fetched from GitHub.
 */
export const getStaticPaths: GetStaticPaths<ApiDocsParams> = async () => {
	// Use the hard-coded version data
	const versionData = await getVersionData()
	return await getApiDocsStaticPaths({ productSlug: PRODUCT_SLUG, versionData })
}

/**
 * Get static props, using `versionData` fetched from GitHub.
 *
 * We need all version data for the version selector,
 * and of course we need specific data for the current version.
 */
export const getStaticProps: GetStaticProps<
	ApiDocsViewProps,
	ApiDocsParams
> = async ({ params }: { params: ApiDocsParams }) => {
	// Use the hard-coded version data
	const versionData = await getVersionData()
	// Return static props
	return await getApiDocsStaticProps({
		productSlug: PRODUCT_SLUG,
		baseUrl: BASE_URL,
		pathParts: params.page,
		versionData,
	})
}

export default ApiDocsView
