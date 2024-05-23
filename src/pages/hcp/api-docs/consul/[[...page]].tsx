/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Lib
import { fetchCloudApiVersionData } from 'lib/api-docs/fetch-cloud-api-version-data'
import { ApiDocsVersionData } from 'lib/api-docs/types'
// View
import OpenApiDocsView from 'views/open-api-docs-view'
import {
	schemaModShortenHcp,
	schemaModProtobufAny,
} from 'views/open-api-docs-view/utils/massage-schema-utils'
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
	basePath: '/hcp/api-docs/consul',
	productSlug: 'hcp',
	serviceProductSlug: 'consul',
	githubSourceDirectory: {
		owner: 'hashicorp',
		repo: 'hcp-specs',
		path: 'specs/cloud-global-network-manager-service',
		ref: 'main',
	},
	statusIndicatorConfig: {
		pageUrl: 'https://status.hashicorp.com',
		endpointUrl:
			'https://status.hashicorp.com/api/v2/components/sxffkgfb4fhb.json',
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
	 * Massage the schema data a little bit
	 */
	massageSchemaForClient: (schemaData: OpenAPIV3.Document) => {
		//  Replace "HashiCorp Cloud Platform" with "HCP" in the title
		const withShortTitle = schemaModShortenHcp(schemaData)
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
		const withShortProtobufDocs = schemaModProtobufAny(withShortTitle)
		// Return the schema data with modifications
		return withShortProtobufDocs
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
	/**
	 * TODO: add in support for conditionally publishing specs in hcp-specs repo
	 * For now just manually filtering out this spec as per request in slack.
	 * https://hashicorp.slack.com/archives/C5FSPUGDS/p1698178472462449
	 */
	const filteredVersionData = versionData.filter(
		(version: ApiDocsVersionData) => version.versionId !== '2022-02-15'
	)

	// Generate static props based on page configuration, params, and versionData
	return await getOpenApiDocsStaticProps({
		...PAGE_CONFIG,
		context: { params },
		versionData: filteredVersionData,
	})
}

export default OpenApiDocsView
