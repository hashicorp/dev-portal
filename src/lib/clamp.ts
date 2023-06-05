/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Given a number, a minimum value, and a maximum value,
 * Return the minimum value if the number is less than the minimum,
 * or the maximum value if the number is greater than the maximum,
 * or the number itself if it is greater than the minimum or less than the maximum.
 *
 * Note that if the minimum value provided is greater
 * than the maximum value provided, this function
 * will throw an error.
 */
export default function clamp(
	/** The number to clamp. */
	num: number,
	/** The minimum allowable value. */
	min: number,
	/** The maximum allowable value. */
	max: number
): number {
	if (min > max) {
		throw new Error(
			'clamp was provided a min value greater than its max value. Please ensure the min value is less than or equal to the max value.'
		)
	}
	return Math.min(Math.max(num, min), max)
}
