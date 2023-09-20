/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Given an array of strings,
 * Return the array with zero-width-space elements inserted between each string.
 *
 * This allows the browser to break the string at any of the zero-width-spaces,
 * which is useful for long strings that would otherwise overflow.
 *
 * More information on zero-width spaces:
 * https://en.wikipedia.org/wiki/Zero-width_space
 */
export function addWordBreaks(stringArray: string[]): string {
	return stringArray.join('\u200B')
}
