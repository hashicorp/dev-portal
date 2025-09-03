import React, { createContext, PropsWithChildren } from 'react'
import type { SupportedLocale } from '../types'
import { isSupportedLocale } from './is-supported-locale'
import { DEFAULT_LOCALE } from '../constants'

function resolveLocale(input: string): SupportedLocale {
	return isSupportedLocale(input) ? input : DEFAULT_LOCALE
}

type LocaleContextValue = {
	locale: SupportedLocale
}

interface LocaleProviderProps extends PropsWithChildren {
	/**
	 * Supported locales can be found in `SUPPORTED_LOCALES`.
	 */
	locale: string
}

export const LocaleContext = createContext<LocaleContextValue | undefined>(
	undefined
)

export const LocaleProvider = ({ locale, children }: LocaleProviderProps) => {
	const resolvedLocale = resolveLocale(locale)

	return (
		<LocaleContext.Provider value={{ locale: resolvedLocale }}>
			{children}
		</LocaleContext.Provider>
	)
}
