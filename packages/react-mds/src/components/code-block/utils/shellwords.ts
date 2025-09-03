const scan = (
	string: string,
	pattern: RegExp,
	callback: (match: RegExpMatchArray) => void
) => {
	let result = ''

	while (string.length > 0) {
		const match = string.match(pattern)

		if (match && match.index != null && match[0] != null) {
			result += string.slice(0, match.index)
			result += callback(match)
			string = string.slice(match.index + match[0].length)
		} else {
			result += string
			string = ''
		}
	}

	return result
}

/**
 * Splits a string into an array of tokens in the same way the UNIX Bourne shell does.
 *
 * @param line A string to split.
 * @returns An array of the split tokens.
 */
export const split = (line = '') => {
	const words: string[] = []
	let field = ''
	scan(
		line,
		/\s*(?:([^\s\\'"]+)|'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|(\\.?)|(\S))(\s|$)?/,
		(match) => {
			const [_raw, word, sq, dq, escape, garbage, separator] = match

			if (garbage != null) {
				throw new Error(`Unmatched quote: ${line}`)
			}

			if (word) {
				field += word
			} else {
				let addition

				if (sq) {
					addition = sq
				} else if (dq) {
					addition = dq
				} else if (escape) {
					addition = escape
				}

				if (addition) {
					field += addition.replace(/\\(?=.)/, '')
				}
			}

			if (separator != null) {
				words.push(field)
				field = ''
			}
		}
	)

	if (field) {
		words.push(field)
	}

	return words
}

/**
 * Escapes a string so that it can be safely used in a Bourne shell command line.
 *
 * @param str A string to escape.
 * @returns The escaped string.
 */
export const escape = (str = '') => {
	return str.replace(/([^A-Za-z0-9_\-.,:/@\n])/g, '\\$1').replace(/\n/g, "'\n'")
}
