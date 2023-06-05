/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Stringifies JSON, replacing circular references with `undefined`.
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
 * Remove circular references in an object
 *
 * TODO: this is specifically needed for Waypoint's API docs.
 * We should dig into why this is needed, and figure out where it might
 * be breaking or compromising the API docs UI, which seems possible.
 *
 * Alternately, we should refactor the OpenAPI docs page to be more explicit
 * in the data types it requires, and do more of the schema processing
 * server-side in `getStaticProps`. There should be no need to pass
 * circular references as static props for rendering (as that would result
 * in an infinitely deep properties being rendered, for example), and we
 * should likely address and resolve that intentionally.
 */
function removeCircularReferences(obj) {
	return JSON.parse(safeStringifyJson(obj))
}

export { removeCircularReferences }
