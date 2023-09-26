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
	serviceProductSlug: 'consul',
	basePath: '/hcp/api-docs/consul',
	githubSourceDirectory: {
		owner: 'hashicorp',
		repo: 'hcp-specs',
		/**
		 * TODO: confirm this is the correct spec path, Tu mentioned it might change:
		 * https://hashicorp.slack.com/archives/C059X7QKWAV/p1695671344421569?thread_ts=1695670284.652479&cid=C059X7QKWAV
		 */
		path: 'specs/cloud-global-network-manager-service',
		/**
		 * TODO: ensure spec exists on `main`, then update this to `ref: 'main'`.
		 * For now, we point to a specific commit SHA where the spec exists,
		 * a commit from this PR: https://github.com/hashicorp/hcp-specs/pull/6
		 */
		ref: '0767e89aef156667df605ab52f18917039dfde65',
	},
	navResourceItems: [
		{
			title: 'Tutorial Library',
			href: '/tutorials/library?product=consul&edition=hcp',
		},
		{
			title: 'Certifications',
			href: '/certifications/networking-automation',
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
		navResourceItems: PAGE_CONFIG.navResourceItems,
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
