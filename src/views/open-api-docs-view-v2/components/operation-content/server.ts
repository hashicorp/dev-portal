/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { OpenAPIV3 } from 'openapi-types'
import type { OperationContentProps } from '.'

/**
 * TODO: transform the schemaData into useful props
 */
export default async function getOperationContentProps(
	operationSlug: string,
	schemaData: OpenAPIV3.Document
): Promise<OperationContentProps> {
	return {
		_placeholder: {
			viewToImplement: `Operation view for ${operationSlug}`,
			schemaSample: schemaData.info,
		},
	}
}
