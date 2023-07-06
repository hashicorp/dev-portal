import { getPathItemObjects } from './get-path-item-objects'
import type { SchemaJson } from '../types'

/* Given a schema, return a flattened list of operation objects */
export function getOperationObjects(schemaJson: SchemaJson): $TSFixMe[] {
	const pathItemObjects = getPathItemObjects(schemaJson)
	const operationObjects = pathItemObjects.reduce((acc, pathItemObject) => {
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

			/**
			 * The Waypoint API docs have circular references.
			 * We manually try to deal with those here. This is a band-aid solution,
			 * it seems to have unintended side-effects when applied to other
			 * products' API docs, and almost certainly merits further investigation.
			 *
			 * Asana task:
			 * https://app.asana.com/0/1202097197789424/1203989531295664/f
			 */
			const data = pathItemObject[type]

			// If the request type is supported, push the associated operation
			acc.push({
				__type: type,
				__path: pathItemObject.__path,
				...data,
			})
			return acc
		}, [])
		return acc.concat(pathOperations)
	}, [])

	return operationObjects
}
