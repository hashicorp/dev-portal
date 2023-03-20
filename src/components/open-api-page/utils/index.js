/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { capitalCase } from 'change-case'
import slugify from '@hashicorp/remark-plugins/generate_slug'
import { removeCircularReferences } from './remove-circular-references'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'

/* Given an array of values, return an array without duplicate items */
function filterUnique(array) {
	return array.filter((value, idx) => array.indexOf(value) === idx)
}

/* Given a serviceId, which is typically PascalCase string, return a slugified kebab-case string (ie: pascal-case rather than pascalcase) */
function getServicePathSlug(serviceId) {
	return slugify(capitalCase(serviceId))
}

/* Given an operationId, return the "serviceId" */
function getServiceId(operation) {
	// We expect operationIds to have two parts, separated by an underscore
	// The "serviceId" is the first part of the value
	//
	// Previous operationId-based approach:
	// return operation.operationId.split('_')[0]
	//
	// Revised tag-based approach:
	const { tags } = operation
	if (!tags || tags.length == 0 || typeof tags[0] !== 'string') {
		throw new Error(
			`Error in .swagger.json file: all operation objects must have at least one valid 'tag' string, to be used to group operations by service. Operation with 'operationId' '${operation.operationId}' appears to have empty tags.`
		)
	}
	const tagParts = tags[0].split('.')
	return tagParts[tagParts.length - 1]
}

/* Given a schema, return an array of unique operation "category" strings */
function getServiceIds(operationObjects) {
	const operationIdCategories = operationObjects
		.map((o) => getServiceId(o))
		.sort()
	// Several related operationIds may have the same "category" part,
	// so we filter for unique values before returning
	return filterUnique(operationIdCategories)
}

/* Given a schema, return a flattened list of operation objects */
function getOperationObjects(schema, mayHaveCircularReferences = false) {
	const pathItemObjects = Object.keys(schema.paths).reduce((acc, path) => {
		acc.push({ __path: path, ...schema.paths[path] })
		return acc
	}, [])

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
			const data = mayHaveCircularReferences
				? removeCircularReferences(pathItemObject[type])
				: pathItemObject[type]

			// If the request type is supported, push the associated operation
			acc.push({
				__type: type,
				__path: pathItemObject.__path,
				...stripUndefinedProperties(data),
			})
			return acc
		}, [])
		return acc.concat(pathOperations)
	}, [])

	return operationObjects
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	getServicePathSlug,
	getOperationObjects,
	getServiceId,
	getServiceIds,
}
export { getServicePathSlug, getOperationObjects, getServiceId, getServiceIds }
