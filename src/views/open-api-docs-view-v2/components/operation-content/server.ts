/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { OpenAPIV3 } from 'openapi-types'
import type { OperationContentProps } from '.'
import { getOperationObjects } from 'views/open-api-docs-view-v2/utils/get-operation-objects'

/**
 * TODO: transform the schemaData into useful props
 */
export default async function getOperationContentProps(
	operationSlug: string,
	schemaData: OpenAPIV3.Document
): Promise<OperationContentProps> {
	const operationObjects = getOperationObjects(schemaData)
	const operationObject = operationObjects.find(
		(operationObject) => operationObject.operationId === operationSlug
	)
	return {
		_placeholder: {
			viewToImplement: `Operation view for ${operationSlug}`,
			schemaSample: schemaData.info,
			operationObject,
		},
	}
}
