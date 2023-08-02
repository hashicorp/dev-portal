/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { snakeCase } from 'change-case'
import slugify from 'slugify'
// Local
import { getRequestData, getResponseData, truncateHcpOperationPath } from './'
// Types
import type { OperationProps } from '../types'
import type { OpenAPIV3 } from 'openapi-types'

/**
 * Given a schema, return a flattened list of operation prop objects.
 */
export async function getOperationProps(
	schemaJson: OpenAPIV3.Document
): Promise<OperationProps[]> {
	// Set up an accumulator array
	const operationObjects: OperationProps[] = []
	/**
	 * Iterate over all paths in the schema.
	 * Each path can support many operations through different request types.
	 */
	for (const [path, pathItemObject] of Object.entries(schemaJson.paths)) {
		for (const [type, operation] of Object.entries(pathItemObject)) {
			// String values are apparently possible, but not sure how to support them
			if (typeof operation === 'string') {
				continue
			}
			// We only want operation objects.
			if (!('operationId' in operation)) {
				continue
			}

			/**
			 * Parse request and response details for this operation
			 */
			const parameters = 'parameters' in operation ? operation.parameters : []
			const requestData = await getRequestData(
				parameters,
				operation.requestBody
			)
			const responseData = await getResponseData(operation.responses)

			/**
			 * Format and push the operation props
			 */
			operationObjects.push({
				operationId: operation.operationId,
				slug: slugify(snakeCase(operation.operationId), { lower: true }),
				type,
				path: {
					full: path,
					truncated: truncateHcpOperationPath(path),
				},
				summary: operation.summary,
				requestData,
				responseData,
				_placeholder: {
					__type: type,
					__path: path,
					...operation,
				},
			})
		}
	}

	return operationObjects
}
