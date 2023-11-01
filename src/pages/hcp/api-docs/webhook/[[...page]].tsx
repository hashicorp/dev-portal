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

/**
 * Configure the specific spec file we want to fetch,
 * as well as some other minor content details and bells & whistles.
 */
const PAGE_CONFIG: OpenApiDocsPageConfig = {
	basePath: '/hcp/api-docs/webhook',
	productSlug: 'hcp',
	githubSourceDirectory: {
		owner: 'hashicorp',
		repo: 'hcp-specs',
		path: 'specs/cloud-webhook',
		ref: 'main',
	},
	statusIndicatorConfig: {
		pageUrl: 'https://status.hashicorp.com',
		endpointUrl:
			'https://status.hashicorp.com/api/v2/components/0q55nwmxngkc.json',
	},
	navResourceItems: [
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
	 * Massage the schema data a little bit, replacing
	 * "HashiCorp Cloud Platform" in the title with "HCP".
	 */
	massageSchemaForClient: (schemaData: OpenAPIV3.Document) => {
		// Replace "HashiCorp Cloud Platform" with "HCP" in the title
		const massagedTitle = schemaData.info.title.replace(
			'HashiCorp Cloud Platform',
			'HCP'
		)
		// Return the schema data with the revised title
		const massagedInfo = { ...schemaData.info, title: massagedTitle }
		return { ...schemaData, info: massagedInfo }
	},
}

/**
 * Get static paths, using `versionData` fetched from GitHub.
 */
export { getStaticPaths }

/**
 * Get static props, using `versionData` fetched from GitHub.
 *
 * Note that only a single version may be returned, in which case the
 * version switcher will not be rendered.
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
