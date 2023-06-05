/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { traverse } from 'lib/traverse'

/**
 * Given an array of target keys, and a data object to traverse,
 * Return all unique values referenced by any of the target keys.
 */
export default async function gatherUniqueValues(
	/* An array of keys to match when looking for values */
	targetKeys: (string | number | symbol)[],
	/** The data to be traversed. */
	data: unknown
): Promise<unknown[]> {
	const possibleValues = []
	// Traverse the provided data structure
	await traverse(data, (key, value) => {
		// Stop on keys found in the targetKeys array
		const isTargetKey = targetKeys.indexOf(key) !== -1
		if (isTargetKey) {
			// Extract items from matching arrays, rather than
			// adding the whole array as a possible value
			const newValues = Array.isArray(value) ? value : [value]
			newValues.forEach((newValue) => {
				const isFreshValue = possibleValues.indexOf(newValue) == -1
				// Push any new, not-yet-seen values to the possibleValues array
				if (isFreshValue) {
					possibleValues.push(newValue)
				}
			})
		}
		return value
	})
	return possibleValues
}
