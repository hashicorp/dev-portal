import { useContext } from 'react'
import { DEFAULT_LOCALE } from '../constants'
import { LocaleContext } from './locale-provider'
import { SupportedLocale } from '../types'

let hasWarned = false

export function useLocale(): SupportedLocale {
	const locale = useContext(LocaleContext)?.locale

	if (!locale && typeof window !== 'undefined' && !hasWarned) {
		hasWarned = true
		console.warn(
			`[@web/utils] No <LocaleProvider> found. Defaulting to "${DEFAULT_LOCALE}".`
		)
	}

	return locale || DEFAULT_LOCALE
}
