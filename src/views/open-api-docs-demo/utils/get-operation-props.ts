import { snakeCase } from 'change-case'
import type { OperationProps, OpenApiSchema } from '../types'
import slugify from 'slugify'

/* Given a schema, return a flattened list of operation objects */
export function getOperationProps(schemaJson: OpenApiSchema): OperationProps[] {
	//
	const operationObjects = Object.keys(schemaJson.paths).reduce((acc, path) => {
		//
		const pathItemObject = schemaJson.paths[path]

		// Each path can support many operations through different request types
		const requestTypes = [
			'get',
			'put',
			'post',
			'delete',
			'options',
			'head',
			'patch',
		]
		const pathOperations = requestTypes.reduce((acc, type) => {
			//  Not all paths will support every request type
			if (!pathItemObject[type]) {
				return acc
			}

			const data = pathItemObject[type]

			// If the request type is supported, push the associated operation
			acc.push({
				operationId: data.operationId,
				slug: slugify(snakeCase(data.operationId), { lower: true }),
				summary: data.summary,
				_data: {
					__type: type,
					__path: path,
					...data,
				},
			})
			return acc
		}, [])
		return acc.concat(pathOperations)
	}, [])

	return operationObjects
}
