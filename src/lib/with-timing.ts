/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * A utility method to wrap a function, and log execution time.
 */
export async function withTiming<T>(
	label: string,
	fn: () => Promise<T> | T,
	group: boolean = true
): Promise<T> {
	if (process.env.HC_DEBUG_TIMINGS === '1') {
		if (group) {
			console.group(label)
		}
		console.time(label)

		let result: Promise<T> | T
		try {
			result = fn()
		} finally {
			if (group) {
				console.groupEnd()
			}
			console.timeEnd(label)
		}
		return result
	} else {
		// passthrough if env var is not specified
		return fn()
	}
}
