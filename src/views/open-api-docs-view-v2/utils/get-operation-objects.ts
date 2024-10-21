/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * TODO: implement properly and add comments,
 * messing around for now.
 */
export function getOperationObjects(openApiDocument: $TSFixMe): $TSFixMe[] {
	//
	const operationObjects = []
	//
	for (const [_path, pathItemObject] of Object.entries(openApiDocument.paths)) {
		for (const [type, operation] of Object.entries(pathItemObject)) {
			// String values are apparently possible, but not sure how to support them
			if (typeof operation === 'string') {
				continue
			}
			// We only want operation objects.
			if (!('operationId' in operation)) {
				continue
			}
			//
			operationObjects.push({ type, ...operation })
		}
	}
	//
	return operationObjects
}
