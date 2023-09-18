/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Split a string on capital letters, returning an array of strings.
 *
 * Works kind of like `string.split()`, but splits on capital letters only.
 */
export function splitOnCapitalLetters(str: string): string[] {
	const lowerCased = str.toLowerCase()
	const result: string[] = []
	let buffer = ''
	for (let i = 0; i < str.length; i++) {
		/**
		 * If we have a lowercase character, add it to the buffer.
		 * If we have an uppercase character, add the buffer to the result,
		 * and reset the buffer.
		 */
		const isLowerCase = str[i] === lowerCased[i]
		if (isLowerCase) {
			buffer += str[i]
		} else {
			result.push(buffer)
			buffer = str[i]
		}
	}
	// Append any stray buffer, if it's non-empty
	if (buffer !== '') {
		result.push(buffer)
	}
	// Return the array of strings
	return result
}
