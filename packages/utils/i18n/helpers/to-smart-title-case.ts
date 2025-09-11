import { smallWordsByLocale } from '../constants'
import { SupportedLocale } from '../types'

export function toSmartTitleCase(
	text: string,
	locale: SupportedLocale
): string {
	const smallWords = smallWordsByLocale[locale]
	const segments = text.toLocaleLowerCase(locale).split(/([\s\-:,.]+)/)

	let capitalizeNext = true

	return segments
		.map((segment) => {
			if (/^[\s\-:,.]+$/.test(segment)) {
				// If punctuation ends a sentence-like clause, capitalize the next word
				if (/[:.!?]\s*$/.test(segment)) {
					capitalizeNext = true
				}
				return segment
			}

			// For non-cased languages (ja, ko), return as-is
			if (!segment.charAt(0).toLocaleUpperCase) return segment

			if (capitalizeNext || !smallWords.has(segment)) {
				capitalizeNext = false
				return segment.charAt(0).toLocaleUpperCase(locale) + segment.slice(1)
			} else {
				return segment
			}
		})
		.join('')
}
