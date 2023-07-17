import { snakeCase } from 'change-case'
import type {
	OperationProps,
	OpenApiSchema,
	OperationSchema,
	ParameterSchema,
	ParameterProps,
} from '../types'
import getBodyParamProps from './get-body-parameter-props'
import slugify from 'slugify'

const REQUEST_TYPES = [
	'get',
	'put',
	'post',
	'delete',
	'options',
	'head',
	'patch',
]

/**
 * Given a schema, return a flattened list of operation objects
 * */
export function getOperationProps(schemaJson: OpenApiSchema): OperationProps[] {
	// Set up an accumulator array
	const operationObjects = []
	/**
	 * Iterate over all paths in the schema.
	 * Each path can support many operations through different request types.
	 */
	for (const path in schemaJson.paths) {
		const pathItemObject = schemaJson.paths[path]
		for (const type of REQUEST_TYPES) {
			// TODO: figure out how to not cast types here
			const operation = pathItemObject[type] as OperationSchema
			//  Continue if a given request type is not supported on this path
			if (!operation) {
				continue
			}

			// Get parameters
			// TODO: figure out how to not cast types here
			const parameters = operation.parameters as ParameterSchema[]

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
						pathParameters.push({ name: parameter.name })
					} else if (parameter.in === 'query') {
						queryParameters.push({ name: parameter.name })
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
