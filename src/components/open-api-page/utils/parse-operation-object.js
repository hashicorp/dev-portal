import { stripUndefinedProperties } from 'lib/strip-undefined-props'

/**
 * Stringifies JSON, even if it has duplicate references
 *
 * TODO: add more detail.
 */
function safeStringifyJson(obj, indent = 2) {
	let cache = []
	const retVal = JSON.stringify(
		obj,
		(_key, value) => {
			if (typeof value === 'object' && value !== null) {
				if (cache.includes(value)) {
					return undefined // Duplicate reference found, discard key
				} else {
					return cache.push(value) && value // Store value in our collection
				}
			} else {
				return value
			}
		},
		indent
	)
	cache = null
	return retVal
}

/**
 * Removes circular references and unnecessary data from operation objects.
 *
 * TODO: add more detail.
 */
function parseOperationObject(operationObject) {
	const { operationId, parameters, responses, summary, tags } = operationObject

	const parsedObject = {
		operationId,
		summary,
		tags,
	}

	if (Array.isArray(parameters)) {
		const parsedParameters = parameters.map((p) => {
			const { name, required, type, description, items, properties } = p
			return {
				name,
				items,
				properties,
				required,
				type,
				description,
				in: p.in,
			}
		})
		parsedObject.parameters = parsedParameters
	}

	if (responses) {
		const parsedResponses = Object.keys(responses)
			.map((key) => {
				const response = responses[key]
				const safeResponse = JSON.parse(safeStringifyJson(response))
				return { key, value: safeResponse }
			})
			.reduce((acc, entry) => {
				acc[entry.key] = entry.value
				return acc
			}, {})
		parsedObject.responses = parsedResponses
	}

	return stripUndefinedProperties(parsedObject)
}

export { parseOperationObject }
