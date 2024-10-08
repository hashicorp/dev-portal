/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Lib
import { fetchCloudApiVersionData } from 'lib/api-docs/fetch-cloud-api-version-data'
// View
import OpenApiDocsView from 'views/open-api-docs-view'
import {
	getStaticPaths,
	getStaticProps as getOpenApiDocsStaticProps,
} from 'views/open-api-docs-view/server'
// Types
import type { GetStaticProps, GetStaticPropsContext } from 'next'
import type { OpenAPIV3 } from 'openapi-types'
import type {
	OpenApiDocsParams,
	OpenApiDocsViewProps,
	OpenApiDocsPageConfig,
} from 'views/open-api-docs-view/types'
import { schemaModShortenHcp } from 'views/open-api-docs-view/utils/massage-schema-utils'

/**
 * OpenApiDocsView server-side page configuration
 */
const PAGE_CONFIG: OpenApiDocsPageConfig = {
	productSlug: 'hcp',
	serviceProductSlug: 'waypoint',
	basePath: '/hcp/api-docs/waypoint',
	githubSourceDirectory: {
		owner: 'hashicorp',
		repo: 'hcp-specs',
		path: 'specs/cloud-waypoint-service',
		ref: 'main',
	},
	groupOperationsByPath: true,
	statusIndicatorConfig: {
		pageUrl: 'https://status.hashicorp.com',
		endpointUrl:
			'https://status.hashicorp.com/api/v2/components/1zyf32pwbfmz.json',
	},
	navResourceItems: [
		{
			title: 'Tutorials',
			href: '/waypoint/tutorials/hcp-waypoint',
		},
		{
			title: 'Community',
			href: 'https://discuss.hashicorp.com/',
		},
		{
			title: 'Support',
			href: 'https://www.hashicorp.com/customer-success',
		},
	],

	/**
	 * Massage the schema data a little bit
	 */
	massageSchemaForClient: (schemaData: OpenAPIV3.Document) => {
		//  Replace "HashiCorp Cloud Platform" with "HCP" in the title
		const withShortTitle = schemaModShortenHcp(schemaData)
		// Return the schema data with modifications
		return withShortTitle
	},
}

/**
 * Get static paths, using `versionData` fetched from GitHub.
 */
export { getStaticPaths }

/**
 * Get static props, using `versionData` fetched from GitHub.
 *
 * We need all version data for the version selector,
 * and of course we need specific data for the current version.
 */
export const getStaticProps: GetStaticProps<
	OpenApiDocsViewProps,
	OpenApiDocsParams
> = async ({ params }: GetStaticPropsContext<OpenApiDocsParams>) => {
	// Fetch all version data, based on remote `stable` & `preview` subfolders
	const versionData = await fetchCloudApiVersionData(
		PAGE_CONFIG.githubSourceDirectory
	)
	// Generate static props based on page configuration, params, and versionData
	return await getOpenApiDocsStaticProps({
		...PAGE_CONFIG,
		context: { params },
		versionData,
	})
}

export default OpenApiDocsView
