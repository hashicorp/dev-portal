import { snakeCase } from 'change-case'
import type { OperationProps, OpenApiDocument, ParameterProps } from '../types'
import getBodyParamProps from './get-body-parameter-props'
import slugify from 'slugify'
import { getParameterPropsFromParameter } from './get-parameter-props'

/**
 * Given a schema, return a flattened list of operation objects
 * */
export function getOperationProps(
	schemaJson: OpenApiDocument
): OperationProps[] {
	// Set up an accumulator array
	const operationObjects = []
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
			console.log(operation)

			// Get parameters, if there are any
			const parameters = 'parameters' in operation ? operation.parameters : []

			const pathParameters: ParameterProps[] = []
			const queryParameters: ParameterProps[] = []
			let bodyParameters: ParameterProps[] = []
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
					//
					if (parameter.in === 'path') {
						pathParameters.push(getParameterPropsFromParameter(parameter))
					} else if (parameter.in === 'query') {
						queryParameters.push(getParameterPropsFromParameter(parameter))
					} else if (parameter.in === 'body') {
						// We expect a single body parameter
						bodyParameters = getBodyParamProps(parameter)
					}
				}
			}
			// If the request type is supported, push the associated operation
			operationObjects.push({
				operationId: operation.operationId,
				slug: slugify(snakeCase(operation.operationId), { lower: true }),
				summary: operation.summary,
				bodyParameters,
				pathParameters,
				queryParameters,
				_data: {
					__type: type,
					__path: path,
					...operation,
				},
			})
		}
	}

	return operationObjects
}
