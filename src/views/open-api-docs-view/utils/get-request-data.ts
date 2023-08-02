/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utils
import {
	getPropertyDetailPropsFromParameter,
	getPropertyDetailPropsFromSchemaObject,
} from './get-property-detail-props'
// Types
import type { PropertyDetailsProps } from '../components/property-details'
import type { OpenAPIV3 } from 'openapi-types'

/**
 * Given OpenAPI parameter objects,
 * Return request data formatted for display.
 */
export async function getRequestData(
	parameters: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[]
): Promise<
	{
		heading: string
		propertyDetails: PropertyDetailsProps[]
	}[]
> {
	// Build arrays of path, query, and body parameters
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
	// Build an array of request data, using any parameters present
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
	// Return everything
	return requestData
}

/**
 * Given the parameter object from a body parameter,
 * which we expect to be an object with a schema if it exists,
 *
 * Return property detail data.
 */
export async function getBodyParameterProps(
	bodyParam: OpenAPIV3.ParameterObject
): Promise<PropertyDetailsProps[]> {
	// Skip the bodyParam.schema if it's a reference
	// We don't expect references, but for typing purposes we handle them.
	if ('$ref' in bodyParam.schema) {
		return []
	}
	/**
	 * Note: we expect body schemas to always be objects at their root.
	 * We flatten the body properties to avoid showing a redundant object.
	 */
	const bodyProps = []
	for (const [key, value] of Object.entries(bodyParam.schema.properties)) {
		// Skip reference objects, we expect these to be de-referenced
		// before this function is called
		if ('$ref' in value) {
			continue
		}
		// Skip read-only properties
		if (value.readOnly) {
			continue
		}
		// Push props
		bodyProps.push(await getPropertyDetailPropsFromSchemaObject(key, value))
	}
	return bodyProps
}
