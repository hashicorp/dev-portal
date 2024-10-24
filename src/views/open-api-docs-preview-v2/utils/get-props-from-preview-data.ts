/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getStaticProps } from 'views/open-api-docs-view-v2/server'
// Utils
import { getOperationGroupKeyFromPath } from 'views/open-api-docs-view-v2/utils/get-operation-group-key-from-path'
import { schemaTransformShortenHcp } from 'views/open-api-docs-view-v2/schema-transforms/schema-transform-shorten-hcp'
// Types
import type {
	OpenApiDocsViewV2Props,
	OpenApiDocsViewV2Config,
} from 'views/open-api-docs-view-v2/types'
import type { OpenApiPreviewV2InputValues } from '../components/open-api-preview-inputs'

/**
 * Given preview data submitted by the user, which includes OpenAPI JSON,
 * and given an optional operation slug that indicates whether to render
 * a view for a specific operation,
 *
 * Return static props for the appropriate OpenAPI docs view.
 *
 * TODO: this is largely a placeholder for now.
 * Will likely require a few more args to pass to getStaticProps, eg productData
 * for example, but those types of details are not yet needed by the underlying
 * view.
 */
export default async function getPropsFromPreviewData(
	previewData: OpenApiPreviewV2InputValues | null,
	operationSlug: string | null
): Promise<OpenApiDocsViewV2Props | null> {
	// If we don't have any preview data, we can't expect to generate valid props
	if (!previewData) {
		return null
	}
	// Set up transformers for the spec. Typically we want to avoid these,
	// and prefer to have content updates made at the content source... but
	// some shims are used often enough that they feel worth including in the
	// preview too. Namely, shortening to `HCP` in the spec title.
	const schemaTransforms = [schemaTransformShortenHcp]
	// Build page configuration based on the input values
	const pageConfig: OpenApiDocsViewV2Config = {
		basePath: '/open-api-docs-preview-v2',
		operationSlug,
		openApiJsonString: previewData.openApiJsonString,
		schemaTransforms,
		// A generic set of resource links, as a preview of what typically
		// gets added to an OpenAPI docs page.
		resourceLinks: [
			{
				text: 'Tutorial Library',
				href: '/tutorials/library',
			},
			{
				text: 'Certifications',
				href: '/certifications',
			},
			{
				text: 'Community',
				href: 'https://discuss.hashicorp.com/',
			},
			{
				text: 'Support',
				href: 'https://www.hashicorp.com/customer-success',
			},
		],
	}
	// If the user has requested to group operations by path, we'll do so
	// by providing a custom `getOperationGroupKey` function. If this is omitted,
	// we go with the default behaviour of grouping operations based on `tag`.
	if (previewData.groupOperationsByPath) {
		pageConfig.getOperationGroupKey = getOperationGroupKeyFromPath
	}
	// Use the page config to generate static props for the view
	return await getStaticProps(pageConfig)
}
