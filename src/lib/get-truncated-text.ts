/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Given a string and character limit, returns a string truncated to the given
 * limit on full words with an ellipsis at the end.
 */
function getTruncatedText(string: string, characterLimit: number): string {
	let result: string

	if (string.length <= characterLimit) {
		result = string
	} else {
		let characterCount = 0
		const words = string.split(' ')
		const wordsToInclude = []
		words.forEach((word, index) => {
			const wordLength = word.length
			if (characterCount + wordLength <= characterLimit) {
				wordsToInclude.push(word)
				characterCount += wordLength

				// count spaces since they are counted in the string.length comparison
				if (index !== words.length) {
					characterCount++
				}
			}
		})
		result = wordsToInclude.join(' ') + `…`
	}

	return result
}

export default getTruncatedText
