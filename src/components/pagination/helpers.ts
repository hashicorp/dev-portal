// accepts an array and returns a truncated array with interlaced "ellipsis"
// items, based on the current page
export function generateTruncatedList(
	array: number[],
	currentPage: number
): (number | 'ellipsis')[] {
	// do not truncate if there are 5 or fewer pages
	const bypass = array.length <= 5
	if (bypass) {
		return array
	}

	const isLeft = currentPage <= 3
	const isRight = currentPage >= array.length - 2

	// [1,2,3,4,...,99,100]
	if (isLeft) {
		return (
			array
				.slice(0, 4)
				// @ts-expect-error - the output array is typed as (number | 'ellipsis')[]
				.concat('ellipsis' as const)
				.concat(array.slice(-2))
		)
	}
	// [1,2,...,97,98,99,100]
	if (isRight) {
		return (
			array
				.slice(0, 2)
				// @ts-expect-error - the output array is typed as (number | 'ellipsis')[]
				.concat('ellipsis' as const)
				.concat(array.slice(-4))
		)
	}
	// [1,...3,4,5,...,100]
	return array
		.slice(0, 1)
		.concat(
			// @ts-expect-error - the output array is typed as (number | 'ellipsis')[]
			'ellipsis' as const,
			currentPage - 1,
			currentPage,
			currentPage + 1,
			'ellipsis' as const
		)
		.concat(array.slice(-1))
}
