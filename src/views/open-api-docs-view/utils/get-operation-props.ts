// Third-party
import { snakeCase } from 'change-case'
import slugify from 'slugify'
// Local
import {
	getBodyParameterProps,
	getPropertyDetailPropsFromParameter,
	truncateHcpOperationPath,
} from './'
// Types
import type { OperationProps, PropertyDetailProps } from '../types'
import type { OpenAPIV3 } from 'openapi-types'

/**
 * Given a schema, return a flattened list of operation prop objects.
 */
export function getOperationProps(
	schemaJson: OpenAPIV3.Document
): OperationProps[] {
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
			// Get parameters, if there are any
			const parameters = 'parameters' in operation ? operation.parameters : []
			const pathParameters: PropertyDetailProps[] = []
			const queryParameters: PropertyDetailProps[] = []
			let bodyParameters: PropertyDetailProps[] = []
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
						pathParameters.push(getPropertyDetailPropsFromParameter(parameter))
					} else if (parameter.in === 'query') {
						queryParameters.push(getPropertyDetailPropsFromParameter(parameter))
					} else if (parameter.in === 'body') {
						// We expect a single body parameter
						bodyParameters = getBodyParameterProps(parameter)
					}
				}
			}
			// Format and push the operation props
			operationObjects.push({
				operationId: operation.operationId,
				slug: slugify(snakeCase(operation.operationId), { lower: true }),
				type,
				path: {
					full: path,
					truncated: truncateHcpOperationPath(path),
				},
				summary: operation.summary,
				bodyParameters,
				pathParameters,
				queryParameters,
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
