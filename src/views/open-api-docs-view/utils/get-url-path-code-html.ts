/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { addWordBreaksToUrl } from './add-word-breaks-to-url'

/**
 * Given a URL path,
 * Return HTML that represents the URL path, with `{parameters}` syntax
 * highlighted and with word breaks inserted before forward slashes
 * to allow long URLs to wrap to multiple lines.
 */
export default function getUrlPathCodeHtml(urlPath: string): string {
	// Insert word breaks before forward slashes for more logical line breaks
	const urlWithWordBreaks = addWordBreaksToUrl(urlPath)
	// Add syntax highlighting around any {parameters} in the path
	const parameterRegex = /{([^}]+)}/g
	const urlPathForCodeBlock = urlWithWordBreaks.replace(
		parameterRegex,
		'<span class="token regex">{$1}</span>'
	)
	return urlPathForCodeBlock
}
