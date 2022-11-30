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

		let result: T
		try {
			result = await fn()
		} finally {
			if (group) {
				console.groupEnd()
			}
			console.timeEnd(label)
		}
		return result
	} else {
		// passthrough if env var is not specified
		return await fn()
	}
}
