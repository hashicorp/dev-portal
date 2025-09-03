import { SUPPORTED_LOCALES } from '../constants'
import type { SupportedLocale } from '../types'

export function isSupportedLocale(locale: string): locale is SupportedLocale {
	return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}
