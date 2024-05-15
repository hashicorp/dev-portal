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
import shortenToHcpInTitle from 'views/open-api-docs-view/utils/shorten-to-hcp-in-title'

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
	 *
	 * ALSO, TEMPORARY FIX FOR LONG PROTOBUFANY DESCRIPTION:
	 * Ideally this content update would be made when the OpenAPI spec file is
	 * generated, rather than hacked in here. This is intended to quickly
	 * demo the type of change we might make in the original schema file.
	 *
	 * NOTE: this also modifies the incoming `schemaData` in place... would
	 * generally prefer to take a more "immutable" kind of approach, and deep copy
	 * and modify the schema data instead... but this is temporary, so taking
	 * this more hacky and potential-side-effect-y approach for now.
	 */
	massageRawJson: (schemaData: unknown) => {
		const clonedSchemaData = shortenToHcpInTitle(schemaData)
		/**
		 * Check to see if we have the protobufAny definition we intend to modify,
		 * if not then bail early.
		 */
		if (
			typeof clonedSchemaData !== 'object' ||
			!('definitions' in clonedSchemaData) ||
			typeof clonedSchemaData.definitions !== 'object'
		) {
			return clonedSchemaData
		}
		if (
			!('protobufAny' in clonedSchemaData.definitions) ||
			typeof clonedSchemaData.definitions.protobufAny !== 'object'
		) {
			return clonedSchemaData
		}
		const { protobufAny } = clonedSchemaData.definitions
		/**
		 * Modify the description for the `protobufAny` schema (otherwise it's
		 * very very long)
		 */
		if ('description' in protobufAny) {
			protobufAny.description =
				'An arbitrary serialized protocol buffer message. See the [protobufAny documentation](https://protobuf.dev/reference/protobuf/google.protobuf/#any) for more information.'
		}
		/**
		 * Modify the description for protobufAny's @type property
		 */
		if ('properties' in protobufAny) {
			if ('description' in protobufAny.properties['@type']) {
				protobufAny.properties['@type'].description =
					'A URL that describes the type of the serialized protocol buffer message.'
			}
		}
		// Return the schema data (modifications were made in place)
		return clonedSchemaData
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
