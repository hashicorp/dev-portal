import { SupportedLocale } from '../types'

export function toSmartSentenceCase(
	text: string,
	locale: SupportedLocale
): string {
	// Skip transformation for non-cased languages
	if (locale === 'ja' || locale === 'ko') {
		return text
	}

	const match = text.match(/^(\s*[\p{P}\p{Zs}]*)?(\p{L})(.*)$/u)

	if (!match) return text // fallback if no match

	const [, leading, firstChar, rest] = match

	return (
		(leading ?? '') +
		firstChar.toLocaleUpperCase(locale) +
		rest.toLocaleLowerCase(locale)
	)
}
