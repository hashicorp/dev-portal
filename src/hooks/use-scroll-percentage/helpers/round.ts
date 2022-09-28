/**
 * Given a number, and the number of decimals to include,
 * Return the number rounded to the provided number of decimals
 */
export function round(number: number, decimalCount: number) {
	const roundingFactor = Math.pow(10, decimalCount)
	return Math.round(number * roundingFactor) / roundingFactor
}
