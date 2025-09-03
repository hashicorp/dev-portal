import { SupportedLocale } from '../types'

export const DEFAULT_LOCALE = 'en'

export const LOCALE_LANGUAGE_MAP = {
	en: 'English',
	fr: 'Français',
	de: 'Deutsch',
	ja: '日本語',
	ko: '한국어',
	pt: 'Português',
	es: 'Español',
	id: 'Bahasa Indonesia',
}

export const SUPPORTED_LOCALES = Object.keys(
	LOCALE_LANGUAGE_MAP
) as SupportedLocale[]

export const smallWordsByLocale: Record<SupportedLocale, Set<string>> = {
	en: new Set([
		'a',
		'an',
		'and',
		'as',
		'at',
		'but',
		'by',
		'for',
		'in',
		'nor',
		'of',
		'on',
		'or',
		'so',
		'the',
		'to',
		'up',
		'yet',
	]),
	de: new Set(), // Capitalization rules in German don't suppress small words.
	es: new Set([
		'el',
		'la',
		'los',
		'las',
		'un',
		'una',
		'unos',
		'unas',
		'y',
		'o',
		'pero',
		'de',
		'del',
		'al',
		'en',
		'por',
		'para',
		'con',
	]),
	fr: new Set([
		'le',
		'la',
		'les',
		'un',
		'une',
		'et',
		'de',
		'du',
		'des',
		'en',
		'à',
		'au',
		'aux',
		'pour',
		'avec',
	]),
	ja: new Set(), // Japanese doesn't use title casing; characters are not case-sensitive
	ko: new Set(), // Korean doesn't use casing
	pt: new Set([
		'o',
		'a',
		'os',
		'as',
		'um',
		'uma',
		'uns',
		'umas',
		'e',
		'ou',
		'mas',
		'de',
		'do',
		'da',
		'dos',
		'das',
		'em',
		'no',
		'na',
		'nos',
		'nas',
		'por',
		'para',
		'com',
	]),
	id: new Set(), // ! TODO Determine Indonesian's small word rules, and apply them here
}
