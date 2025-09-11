import { toSmartSentenceCase, toSmartTitleCase } from './helpers'
import type { SupportedLocale } from './types'

type Capitalization = 'none' | 'lower' | 'sentence' | 'title' | 'upper'

type DotPrefix<T extends string, U extends string> = `${T}.${U}`

type NestedKeyOf<ObjectType extends object> = {
	[K in keyof ObjectType & string]: ObjectType[K] extends object
		? DotPrefix<K, NestedKeyOf<ObjectType[K]>>
		: K
}[keyof ObjectType & string]

function getByDotPath<T extends object, P extends string>(
	obj: T,
	path: P
): unknown {
	return path.split('.').reduce((acc: unknown, part) => {
		if (typeof acc === 'object' && acc !== null && part in acc) {
			return (acc as Record<string, unknown>)[part]
		}
		return undefined
	}, obj)
}

export function createLocalize<Messages extends Record<string, unknown>>(
	localizations: Record<SupportedLocale, Messages>,
	fallbackLocale: SupportedLocale = 'en'
) {
	type Key = NestedKeyOf<Messages>

	return function translate(
		key: Key,
		locale: SupportedLocale,
		capitalization?: Capitalization
	): string {
		const word =
			getByDotPath(localizations[locale], key) ??
			getByDotPath(localizations[fallbackLocale], key)

		if (typeof word !== 'string') return ''

		switch (capitalization) {
			case 'title':
				return toSmartTitleCase(word, locale)
			case 'sentence':
				return toSmartSentenceCase(word, locale)
			case 'upper':
				return word.toLocaleUpperCase(locale)
			case 'lower':
				return word.toLocaleLowerCase(locale)
			case 'none':
			default:
				return word
		}
	}
}
