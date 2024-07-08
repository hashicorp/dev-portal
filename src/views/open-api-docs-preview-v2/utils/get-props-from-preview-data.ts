/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getStaticProps } from 'views/open-api-docs-view-v2/server'
// Types
import type { OpenApiDocsViewV2Props } from 'views/open-api-docs-view-v2/types'
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
	// Use the incoming preview data to generate static props for the view
	return await getStaticProps({
		basePath: '/open-api-docs-preview-v2',
		operationSlug,
		openApiJsonString: previewData.openApiJsonString,
	})
}
