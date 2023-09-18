/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getStaticProps } from 'views/open-api-docs-view/server'
// Types
import type { NextApiRequest, NextApiResponse } from 'next'
import type { OpenAPIV3 } from 'openapi-types'
import type { ProductSlug } from 'types/products'

/**
 * Boilerplate page configuration, we could in theory expose this so visitors
 * to the preview tool could manipulate it, but we intentionally just
 * hard-code here to keep the focus of the preview tool on OpenAPI spec
 * contents.
 */
const GENERIC_PAGE_CONFIG = {
	// basePath same no matter what, preview tool is on static route
	basePath: '/open-api-docs-preview',
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
 * We expected posted data to be an OpenAPI spec in JSON format.
 * We also allow an optional schema `info.description`, which normally would be
 * included in the spec content, so that authors can more easily develop
 * and preview their `info.description` content using our preview tool.
 */
type ExpectedBody = {
	openApiJsonString: string
	openApiDescription: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Reject non-POST requests, only POST is allowed
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		res.status(405).json({ error: 'Method not allowed' })
	}

	/**
	 * Build the static props from the POST'ed page configuration data,
	 * which includes the full OpenAPI spec as a string.
	 */
	const { openApiDescription, openApiJsonString } = JSON.parse(
		req.body
	) as ExpectedBody

	/**
	 * Construct some preview data just to match the expected `getStaticProps`
	 * signature. The `versionId` and `releaseStage` don't really matter here.
	 */
	const versionData = [
		{
			versionId: 'preview',
			releaseStage: 'preview',
			sourceFile: openApiJsonString,
		},
	]

	/**
	 * Build static props for the page
	 */
	try {
		const staticProps = await getStaticProps({
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
				if (openApiDescription) {
					schemaData.info.description = openApiDescription
				}
				// Replace "HashiCorp Cloud Platform" with "HCP" in the title
				const massagedTitle = schemaData.info.title.replace(
					'HashiCorp Cloud Platform',
					'HCP'
				)
				// Return the schema data with the revised title
				const massagedInfo = { ...schemaData.info, title: massagedTitle }
				return { ...schemaData, info: massagedInfo }
			},
		})
		// Return the static props as JSON, these can be passed to OpenApiDocsView
		res.status(200).json(staticProps)
	} catch (error) {
		res.status(200).json({ error: error.toString() })
	}
}
