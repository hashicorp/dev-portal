/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { snakeCase } from 'change-case'
import slugify from 'slugify'
// Local
import {
	getBodyParameterProps,
	getPropertyDetailPropsFromParameter,
	truncateHcpOperationPath,
	getPropertyDetailPropsFromSchemaObject,
} from './'
// Types
import type { OperationProps } from '../types'
import type { PropertyDetailsProps } from '../components/property-details'
import type { OpenAPIV3 } from 'openapi-types'

const RESPONSE_HEADINGS: Record<string, string> = {
	'200': 'Successful Response',
	default: 'Default Response',
}

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
			 * Parse request data.
			 */
			const parameters = 'parameters' in operation ? operation.parameters : []
			const pathParameters: PropertyDetailsProps[] = []
			const queryParameters: PropertyDetailsProps[] = []
			let bodyParameters: PropertyDetailsProps[] = []
			if (Array.isArray(parameters)) {
				for (const parameter of parameters) {
					// Skip references
					if ('$ref' in parameter) {
						continue
					}
					// Skip parameters that are not "in" the request
					if (!('in' in parameter)) {
						continue
					}
					// Parse parameters by type
					if (parameter.in === 'path') {
						pathParameters.push(
							await getPropertyDetailPropsFromParameter(parameter)
						)
					} else if (parameter.in === 'query') {
						queryParameters.push(
							await getPropertyDetailPropsFromParameter(parameter)
						)
					} else if (parameter.in === 'body') {
						// We expect a single body parameter
						bodyParameters = await getBodyParameterProps(parameter)
					}
				}
			}
			const requestData: {
				heading: string
				propertyDetails: PropertyDetailsProps[]
			}[] = []
			if (pathParameters.length > 0) {
				requestData.push({
					heading: 'Path Parameters',
					propertyDetails: pathParameters,
				})
			}
			if (queryParameters.length > 0) {
				requestData.push({
					heading: 'Query Parameters',
					propertyDetails: queryParameters,
				})
			}
			if (bodyParameters.length > 0) {
				requestData.push({
					heading: 'Body Parameters',
					propertyDetails: bodyParameters,
				})
			}

			/**
			 * Parse response data
			 */
			const responseData: {
				heading: string
				propertyDetails: PropertyDetailsProps[]
			}[] = []
			for (const key of Object.keys(operation.responses)) {
				const value = operation.responses[key]
				// If this value is a reference, skip it
				if ('$ref' in value) {
					continue
				}
				const definition = value.content['application/json']
				// If this schema is a reference, skip it
				if ('$ref' in definition.schema) {
					continue
				}
				if (definition.schema.properties) {
					const propertyDetails: PropertyDetailsProps[] = []
					for (const propertyKey of Object.keys(definition.schema.properties)) {
						const data = definition.schema.properties[propertyKey]
						// If this schema is a reference, skip it
						if ('$ref' in data) {
							continue
						}
						propertyDetails.push(
							await getPropertyDetailPropsFromSchemaObject(propertyKey, data)
						)
					}
					const responseHeading = RESPONSE_HEADINGS[key]
					responseData.push({
						heading: responseHeading ? responseHeading : key,
						propertyDetails,
					})
				}
			}

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
