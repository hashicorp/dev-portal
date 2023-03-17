/**
 * A small util to guard against invalid values for our
 * pagination query params, such as NaN or negative numbers.
 */
function coerceToDefaultValue(value: number, init: number): number {
	if (isNaN(value) || value < 1) {
		return init
	}
	return value
}

export { coerceToDefaultValue }
