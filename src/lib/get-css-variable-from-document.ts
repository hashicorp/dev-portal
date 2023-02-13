/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

interface GetCSSVariableFromDocumentOptions {
	/**
	 * Whether or not to attempt to coerce the value to an integer
	 */
	asNumber?: boolean

	/**
	 * An optional fallback value which will be returned if the variable can't be read
	 */
	fallback?: number | string
}

/**
 * Attempt to read a CSS custom property value for use in JS.
 */
export default function getCSSVariableFromDocument(
	variableName: string,
	options: GetCSSVariableFromDocumentOptions = {}
): string | number {
	let value: string | number = getComputedStyle(
		document.documentElement
	).getPropertyValue(variableName)

	if (options.asNumber) {
		value = parseInt(value, 10)
	}

	if (options.fallback && (value === '' || Number.isNaN(value))) {
		if (process.env.NODE_ENV === 'development') {
			console.warn(
				`Unable to read ${variableName}, falling back to static value.`
			)
		}
		return options.fallback
	}

	return value
}
