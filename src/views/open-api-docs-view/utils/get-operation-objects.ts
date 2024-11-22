/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { OpenAPIV3 } from 'openapi-types'

/**
 * The OpenAPIV3 OperationObject type, with the `path` and `type` (ie GET, POST)
 * associated with the operation.
 */
export type OperationObject = OpenAPIV3.OperationObject & {
	path: string
	type: string
}

/**
 * Given an OpenAPI document, build an array of operation objects,
 * each including the properties defined for operations in the OpenAPI spec,
 * as well as the `path` and `type` (ie GET, POST, etc) of the operation, and
 * Return the array of operation objects.
 */
export function getOperationObjects(
	openApiDocument: OpenAPIV3.Document
): OperationObject[] {
	//
	const operationObjects = []
	// Iterate over the openApiDocument paths, extracting operations from each.
	for (const [path, pathItemObject] of Object.entries(openApiDocument.paths)) {
		// Iterate over types (GET, POST, etc) in the pathItemObject
		for (const [type, operation] of Object.entries(pathItemObject)) {
			// String values are possible for operations, I think when the value
			// is a reference, but we don't handle them in this context, as we
			// expect our document to already be fully dereferenced.
			if (typeof operation === 'string') {
				continue
			}
			// Add the valid operation object to an array, including path and type
			operationObjects.push({ path, type, ...operation })
		}
	}
	// Return the list of operation objects
	return operationObjects
}
