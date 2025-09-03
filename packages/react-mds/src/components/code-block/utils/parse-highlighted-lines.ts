function parseHighlightedLines(string?: string | boolean) {
	if (typeof string == 'undefined' || string === false || string === '') {
		return []
	}

	if (typeof string !== 'string') {
		throw new Error(
			`The highlight prop must be a string. Received a value of type "${typeof string}" instead.`
		)
	}

	const hasValidChars = /^[-,0-9\s]+$/.test(string)
	if (!hasValidChars) {
		throw new Error(
			`The highlight prop must be a comma-separated list of single integers or ranges with a single dash between two integers. Found invalid characters: "${string}".`
		)
	}

	const parts = string.split(',')
	return parts.reduce((acc, part) => {
		return acc.concat(parsePart(part))
	}, [] as number[])
}

function parsePart(string: string): number[] {
	const dashParts = string.split('-')
	if (dashParts.length > 2) {
		throw new Error(
			`Each comma-separated value in the highlight prop must be either a single integer, or a range with a single dash between two integers. Found a value with multiple dashes: "${string}".`
		)
	}
	// Single integers are easy, just parse and return
	const isSingle = dashParts.length == 1
	if (isSingle) {
		const parsedInt = parseInt(string)
		const isNaN = parsedInt !== parsedInt
		if (isNaN) {
			throw new Error(
				`Each comma-separated value in the highlight prop must be either a single integer, or a range with a single dash between two integers. Found a value that parsed to NaN: "${
					string === '' ? '<empty string>' : string
				}".`
			)
		}
		return [parsedInt]
	}
	// Ranges require a little more logic
	const [startVal, endVal] = dashParts.map((v) => parseInt(v))
	const hasNaNStart = startVal !== startVal
	const hasNaNEnd = endVal !== endVal
	if (hasNaNStart || hasNaNEnd) {
		throw new Error(
			`Each comma-separated value in the highlight prop must be either a single integer, or a range with a single dash between two integers. Found a range that produced a NaN: "${string}".`
		)
	}
	const length = endVal - startVal + 1
	const values = [...Array(length).keys()].map((int) => int + startVal)
	return values
}

export default parseHighlightedLines
