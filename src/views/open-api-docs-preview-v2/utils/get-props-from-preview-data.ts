/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
 * TODO: this is just a placeholder for now.
 */
export default function getPropsFromPreviewData(
	previewData: OpenApiPreviewV2InputValues | null,
	operationSlug: string | null
): OpenApiDocsViewV2Props | null {
	// If we don't have any preview data, we can't expect to generate valid props
	if (!previewData) {
		return null
	}
	// Use the incoming preview data to generate static props for the view
	// TODO: this is just a placeholder for now.
	return { _dev: { serverSideProps: { operationSlug, previewData } } }
}
