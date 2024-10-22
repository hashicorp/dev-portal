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
import { schemaRemoveOperation } from 'views/open-api-docs-view/utils/massage-schema-utils/schema-remove-operation'
import { schemaModComponent } from 'views/open-api-docs-view/utils/massage-schema-utils/schema-mod-component'
import { shortenProtobufAnyDescription } from 'views/open-api-docs-view/utils/massage-schema-utils/schema-mod-protobuf-any'

/**
 * OpenApiDocsView server-side page configuration
 */
const PAGE_CONFIG: OpenApiDocsPageConfig = {
	productSlug: 'hcp',
	serviceProductSlug: 'hcp',
	basePath: '/hcp/api-docs/rbac',
	githubSourceDirectory: {
		owner: 'hashicorp',
		repo: 'hcp-specs',
		path: 'specs/cloud-resource-manager',
		ref: 'main',
	},
	groupOperationsByPath: true,
	navResourceItems: [
		{
			title: 'Tutorial Library',
			href: '/tutorials/library?edition=hcp',
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
		/**
		 * Shorten the description of the protobufAny schema
		 *
		 * Note: ideally this would be done at the content source,
		 * but until we've got that work done, this shortening
		 * seems necessary to ensure incremental static regeneration works
		 * for past versions of the API docs. Without this shortening,
		 * it seems the response size ends up crossing a threshold that
		 * causes the serverless function that renders the page to fail.
		 *
		 * Related task:
		 * https://app.asana.com/0/1207339219333499/1207339701271604/f
		 */
		const withShortProtobufDocs = schemaModComponent(
			schemaData,
			'google.protobuf.Any',
			shortenProtobufAnyDescription
		)
		/**
		 * Hide the org-create API endpoint. Ideally we'd find a way to do
		 * this in the content source, but for now, we're making this change
		 * in order to ship these docs. Note that this is not guaranteed to work
		 * for future versions of this same API, eg if the date-based version
		 * in the path changes. This is one reason why making finding a way to
		 * hide operations using flags at the content source would be preferable.
		 */
		const withoutOrgCreateEndpoint = schemaRemoveOperation(
			withShortProtobufDocs,
			'/resource-manager/2019-12-10/projects',
			'post'
		)
		// Return the schema data with modifications
		return withoutOrgCreateEndpoint
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
