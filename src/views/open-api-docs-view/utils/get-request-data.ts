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
import type { PropertyDetailsGroup } from '../components/operation-details'
import type { PropertyDetailsProps } from '../components/property-details'
import type { OpenAPIV3 } from 'openapi-types'

/**
 * Given OpenAPI parameter objects,
 * Return request data formatted for display.
 */
export async function getRequestData(
	parameters: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[],
	requestBody: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject,
	slugPrefix: string
): Promise<PropertyDetailsGroup[]> {
	// Set up some slugs, we'll need these for headings and for unique prefixes
	const pathParamsSlug = `${slugPrefix}_path-parameters`
	const queryParamsSlug = `${slugPrefix}_query-parameters`
	const bodyParamsSlug = `${slugPrefix}_body-parameters`
	// Build arrays of path, query, and body parameters
	const pathParameters: PropertyDetailsProps[] = []
	const queryParameters: PropertyDetailsProps[] = []
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
					await getPropertyDetailPropsFromParameter(parameter, pathParamsSlug)
				)
			} else if (parameter.in === 'query') {
				queryParameters.push(
					await getPropertyDetailPropsFromParameter(parameter, queryParamsSlug)
				)
			}
		}
	}
	// Build body parameters from requestBody data, if present
	const bodyParameters =
		requestBody && !('$ref' in requestBody)
			? await getBodyParameterProps(requestBody, bodyParamsSlug)
			: []
	// Build an array of request data, using any parameters present
	const requestData: PropertyDetailsGroup[] = []
	if (pathParameters.length > 0) {
		requestData.push({
			heading: { text: 'Path Parameters', slug: pathParamsSlug },
			propertyDetails: pathParameters,
		})
	}
	if (queryParameters.length > 0) {
		requestData.push({
			heading: { text: 'Query Parameters', slug: queryParamsSlug },
			propertyDetails: queryParameters,
		})
	}
	if (bodyParameters.length > 0) {
		requestData.push({
			heading: { text: 'Body Parameters', slug: bodyParamsSlug },
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
	requestBody: OpenAPIV3.RequestBodyObject,
	parentSlug: string
): Promise<PropertyDetailsProps[]> {
	const schema = requestBody.content['application/json'].schema
	// If we don't find the expected schema, return an empty array
	if (!schema) {
		return []
	}
	// We don't expect references, but for typing purposes we handle them.
	if ('$ref' in schema) {
		return []
	}
	/**
	 * Note: we expect body schemas to always be objects at their root.
	 * We flatten the body properties to avoid showing a redundant object.
	 */
	const bodyProps = []
	const requiredProperties = schema.required || []
	for (const [key, value] of Object.entries(schema.properties)) {
		// Skip reference objects, we expect these to be de-referenced
		// before this function is called
		if ('$ref' in value) {
			continue
		}
		// Skip read-only properties
		if (value.readOnly) {
			continue
		}
		const isRequired = requiredProperties.includes(key)
		// Push props
		bodyProps.push(
			await getPropertyDetailPropsFromSchemaObject(
				key,
				value,
				isRequired,
				parentSlug
			)
		)
	}
	return bodyProps
}
