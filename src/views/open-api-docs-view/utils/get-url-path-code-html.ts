/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Given a URL path,
 * Return HTML that represents the URL path, with `{parameters}` syntax
 * highlighted and with `<wbr/>` tags inserted before forward slashes
 * to allow long URLs to wrap to multiple lines.
 */
export default function getUrlPathCodeHtml(urlPath: string): string {
	// Insert <wbr/> before forward slashes for more logical line breaks
	const urlWithWordBreaks = urlPath.replace(/\//g, '/<wbr/>')
	// Add syntax highlighting around any {parameters} in the path
	const parameterRegex = /{([^}]+)}/g
	const urlPathForCodeBlock = urlWithWordBreaks.replace(
		parameterRegex,
		'<span class="token regex">{$1}</span>'
	)
	return urlPathForCodeBlock
}
