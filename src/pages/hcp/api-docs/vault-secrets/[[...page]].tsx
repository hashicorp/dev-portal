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
 * OpenApiDocsView server-side page configuration
 */
const PAGE_CONFIG: OpenApiDocsPageConfig = {
	productSlug: 'hcp',
	serviceProductSlug: 'vault',
	basePath: '/hcp/api-docs/vault-secrets',
	githubSourceDirectory: {
		owner: 'hashicorp',
		repo: 'hcp-specs',
		path: 'specs/cloud-vault-secrets',
		ref: 'main',
	},
	groupOperationsByPath: true,
	statusIndicatorConfig: {
		pageUrl: 'https://status.hashicorp.com',
		endpointUrl:
			'https://status.hashicorp.com/api/v2/components/hk67zg2j2rkd.json',
	},
	navResourceItems: [
		{
			title: 'Tutorial Library',
			href: '/tutorials/library?product=vault&edition=hcp',
		},
		{
			title: 'Certifications',
			href: '/certifications/security-automation',
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
	// If we can't find any version data at all, render a 404 page.
	if (!versionData) {
		return { notFound: true }
	}

	return await getOpenApiDocsStaticProps({
		basePath: PAGE_CONFIG.basePath,
		productSlug: PAGE_CONFIG.productSlug,
		serviceProductSlug: PAGE_CONFIG.serviceProductSlug,
		statusIndicatorConfig: PAGE_CONFIG.statusIndicatorConfig,
		navResourceItems: PAGE_CONFIG.navResourceItems,
		groupOperationsByPath: PAGE_CONFIG.groupOperationsByPath,
		massageSchemaForClient: PAGE_CONFIG.massageSchemaForClient,
		// Pass params to getStaticProps, this is used for versioning
		context: { params },
		// Handle rename of `targetFile` to `sourceFile` for new template
		versionData: versionData.map(({ targetFile, ...rest }) => {
			return { ...rest, sourceFile: targetFile }
		}),
	})
}

export default OpenApiDocsView
