/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import { fetchCloudApiVersionData } from 'lib/api-docs'
// View
import ApiDocsView from 'views/api-docs-view'
import {
	getApiDocsStaticProps,
	getApiDocsStaticPaths,
	ApiDocsParams,
} from 'views/api-docs-view/server'
import { buildApiDocsBreadcrumbs } from 'views/api-docs-view/server/get-api-docs-static-props/utils'
// Components
import {
	PathTruncationAside,
	truncatePackerOperationPath,
} from 'views/api-docs-view/components'
// Types
import type { OperationObjectType } from 'components/open-api-page/types'
import type { ApiDocsViewProps } from 'views/api-docs-view/types'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { isDeployPreview } from 'lib/env-checks'

/**
 * The product slug is used to fetch product data for the layout.
 */
const PRODUCT_SLUG = 'hcp'

/**
 * The baseUrl is used to generate
 * breadcrumb links, sidebar nav levels, and version switcher links.
 */
const BASE_URL = '/hcp/api-docs/packer'

/**
 * We source version data from a directory in the `hcp-specs` repo.
 * See `fetchCloudApiVersionData` for details.
 */
const GITHUB_SOURCE_DIRECTORY = {
	owner: 'hashicorp',
	repo: 'hcp-specs',
	path: 'specs/cloud-packer-service',
	ref: 'main',
}

/**
 * Render `<ApiDocsView />` with custom operation path truncation.
 */
function HcpPackerApiDocsView(props: ApiDocsViewProps) {
	return (
		<ApiDocsView
			{...props}
			massagePathFn={truncatePackerOperationPath}
			renderOperationIntro={({ data }: { data: OperationObjectType }) => (
				<PathTruncationAside path={data.__path} />
			)}
		/>
	)
}

/**
 * Get static paths, using `versionData` fetched from GitHub.
 */
export const getStaticPaths: GetStaticPaths<ApiDocsParams> = async () => {
	// If we are in a deploy preview, don't pre-render any paths
	if (isDeployPreview()) {
		return { paths: [], fallback: 'blocking' }
	}
	// Otherwise, fetch version data, and use that to generate paths
	const versionData = await fetchCloudApiVersionData(GITHUB_SOURCE_DIRECTORY)
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
	// Fetch all version data, based on remote `stable` & `preview` subfolders
	const versionData = await fetchCloudApiVersionData(GITHUB_SOURCE_DIRECTORY)
	// If we can't find any version data at all, render a 404 page.
	if (!versionData) {
		return { notFound: true }
	}
	// Return static props
	return await getApiDocsStaticProps({
		productSlug: PRODUCT_SLUG,
		baseUrl: BASE_URL,
		pathParts: params.page,
		versionData,
		buildCustomBreadcrumbs: ({ productData, serviceData, versionId }) => {
			return buildApiDocsBreadcrumbs({
				productData,
				// HCP API docs at `/api-docs` are not linkable, so we pass url=null
				apiDocs: { name: 'API', url: null },
				serviceData,
				versionId,
			})
		},
	})
}

export default HcpPackerApiDocsView
