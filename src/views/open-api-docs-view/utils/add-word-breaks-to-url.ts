/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { addWordBreaks } from './add-word-breaks'

/**
 * Given a URL string,
 * Return with added word-break-friendly characters before each forward slash.
 */
export function addWordBreaksToUrl(url: string): string {
	return addWordBreaks(
		url
			.split('/')
			.map((v, idx) => (idx === 0 ? [v] : ['/', v]))
			.flat()
	)
}
