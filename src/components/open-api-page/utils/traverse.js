/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

async function visitObject(objectIn, handleNode) {
	let objectOut = {}
	const objectKeys = Object.keys(objectIn)
	for (var i = 0; i < objectKeys.length; i++) {
		const key = objectKeys[i]
		objectOut[key] = await visitProperty(key, objectIn[key], handleNode)
	}
	return objectOut
}

async function visitProperty(key, value, handleNode) {
	const handledValue = await handleNode(key, value)
	if (isObject(value)) {
		return await visitObject(handledValue, handleNode)
	} else if (isArray(handledValue)) {
		return await Promise.all(
			handledValue.map((v) => visitProperty(key, v, handleNode))
		)
	} else {
		return handledValue
	}
}

// Returns true if a value is an array, false otherwise
function isArray(value) {
	return Array.isArray(value)
}

// Returns true if a value is an object, false otherwise
function isObject(value) {
	return value && typeof value === 'object' && value.constructor === Object
}

async function traverse(valueIn, handleNode = (k, v) => v) {
	return await visitProperty(false, valueIn, handleNode)
}

export default traverse
export { isObject, isArray }
