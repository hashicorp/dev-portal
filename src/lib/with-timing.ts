/**
 * https://app.asana.com/0/1200855976946122/1203442542938543
 */
export async function withTiming<T>(
	label: string,
	fn: () => Promise<T>
): Promise<T> {
	console.group(label)
	console.time(label)

	let result: T
	try {
		result = await fn()
	} finally {
		console.groupEnd()
		console.timeEnd(label)
	}
	return result
}
