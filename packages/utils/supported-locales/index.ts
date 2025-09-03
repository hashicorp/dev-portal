import { SUPPORTED_LOCALES } from '../i18n/constants'

// Removes the locale prefix from a given pathname if it matches a supported locale.
//
// This function checks if the first segment of the given `pathname` corresponds to one of the
// supported locales and, if found, removes it, returning the modified pathname. If no locale
// is found at the beginning of the pathname, the original pathname is returned unchanged.
//
// @param {string} pathname - The URL pathname to be processed.
// @returns {string} The pathname with the locale stripped out if a match is found, otherwise the original pathname.
//

export const removeLocaleFromPathname = (pathname: string): string => {
	const localePattern = SUPPORTED_LOCALES.join('|')
	const localeExistsRegex = new RegExp(`^/(${localePattern})(/|$)`)
	const match = pathname.match(localeExistsRegex)

	if (match) {
		return pathname.replace(localeExistsRegex, '/')
	}

	return pathname
}
