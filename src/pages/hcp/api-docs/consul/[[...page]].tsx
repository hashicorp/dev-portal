/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Lib
import { fetchCloudApiVersionData } from 'lib/api-docs/fetch-cloud-api-version-data'
import { ApiDocsVersionData } from 'lib/api-docs/types'
// View
import OpenApiDocsView from 'views/open-api-docs-view'
import shortenToHcpInTitle from 'views/open-api-docs-view/utils/shorten-to-hcp-in-title'
import {
	getStaticPaths,
	getStaticProps as getOpenApiDocsStaticProps,
} from 'views/open-api-docs-view/server'
// Types
import type { GetStaticProps, GetStaticPropsContext } from 'next'
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
	 * Massage the schema data a little bit, replacing
	 * "HashiCorp Cloud Platform" in the title with "HCP".
	 */
	massageRawJson: shortenToHcpInTitle,
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
