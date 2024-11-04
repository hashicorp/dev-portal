/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Given a URL path,
 * Return HTML that represents the URL path, with `{parameters}` syntax
 * highlighted and with word breaks inserted before forward slashes
 * to allow long URLs to wrap to multiple lines.
 */
export function getUrlPathCodeHtml(urlPath: string): string {
	/**
	 * Insert <wbr/> before forward slashes for more logical line breaks
	 *
	 * Note: we can't use zero-width spaces here as in other use cases,
	 * as they show up when the code block contents are copied.
	 */
	const urlWithWordBreaks = urlPath.replace(/\//g, '/<wbr/>')
	// Add syntax highlighting around any {parameters} in the path
	const parameterRegex = /{([^}]+)}/g
	const urlPathForCodeBlock = urlWithWordBreaks.replace(
		parameterRegex,
		'<span class="token regex">{$1}</span>'
	)
	return urlPathForCodeBlock
}
