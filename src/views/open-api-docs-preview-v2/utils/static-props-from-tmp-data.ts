/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utilities
import { getStaticProps } from 'views/open-api-docs-view-v2/server'
import {
	schemaModComponent,
	schemaModDescription,
	schemaModShortenHcp,
	shortenProtobufAnyDescription,
} from 'views/open-api-docs-view/utils/massage-schema-utils'
// Types
import type { OpenAPIV3 } from 'openapi-types'
import type { ProductSlug } from 'types/products'
import { OpenApiDocsViewV2Props } from 'views/open-api-docs-view-v2/types'

/**
 * Boilerplate page configuration.
 *
 * We could in theory expose this so visitors to the preview tool could edit it,
 * but we intentionally hard-code it here instead, in order to keep the focus
 * of the preview tool on OpenAPI spec contents.
 */
const GENERIC_PAGE_CONFIG = {
	// basePath is the same no matter what, preview tool is on static route
	basePath: '/open-api-docs-preview-v2',
	// No versioning in the preview tool, focus on one spec file at a time
	context: { params: { page: [] } },
	// Product slug, using HCP to just show a generic HashiCorp logo,
	// so that the preview tool's focus can remain on the spec file contents
	productSlug: 'hcp' as ProductSlug,
	// Generic resource items, we can set more specific ones closer to launch
	navResourceItems: [
		{
			title: 'Tutorial Library',
			href: '/tutorials/library',
		},
		{
			title: 'Certifications',
			href: '/certifications',
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
}

/**
 * TODO: write description
 */
export default async function staticPropsFromTmpData(
	tmpData,
	operationSlug
): Promise<OpenApiDocsViewV2Props> {
	const { openApiJsonString, openApiDescription, groupOperationsByPath } =
		tmpData
	/**
	 * Construct some version data just to match the expected `getStaticProps`
	 * signature. The `versionId` and `releaseStage` don't really matter here.
	 */
	const versionData = [
		{
			versionId: 'preview',
			releaseStage: 'preview',
			sourceFile: openApiJsonString,
		},
	]
	//
	console.log('Attempting to getStaticProps...')
	const getStaticPropsResult = await getStaticProps({
		// Pass the operationSlug, determines which type of page to render
		operationSlug,
		// TODO write description
		groupOperationsByPath,
		// Pass the bulk of the page config
		...GENERIC_PAGE_CONFIG,
		// Pass the constructed version data
		versionData,
		/**
		 * Massage the schema data a little bit, replacing
		 * "HashiCorp Cloud Platform" in the title with "HCP".
		 */
		massageSchemaForClient: (schemaData: OpenAPIV3.Document) => {
			// Replace the schema description with the POST'ed description, if present
			const withCustomDescription = schemaModDescription(
				schemaData,
				(description) => openApiDescription || description
			)
			// Replace "HashiCorp Cloud Platform" with "HCP" in the title
			const withShortTitle = schemaModShortenHcp(withCustomDescription)
			// Short protobufAny descriptions
			const withShortProtobufAny = schemaModComponent(
				withShortTitle,
				'protobufAny',
				shortenProtobufAnyDescription
			)
			// Return the schema data with modifications
			return withShortProtobufAny
		},
	})
	if (!('props' in getStaticPropsResult)) {
		throw new Error('getStaticProps did not return props.')
	}

	return getStaticPropsResult.props
}
