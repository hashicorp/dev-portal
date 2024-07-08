/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Given a string, add zero-width spaces between lower and uppercase letters.
 *
 * This allows long camelCase or PascalCase strings to break at word boundaries.
 * As an example, "VeryLongCamelCaseString" would otherwise not have clear
 * word boundaries, and would risk either overflowing (without additional CSS)
 * or breaking in strange places. Adding zero-width spaces allows the string
 * to break at the casing-based word boundaries.
 */
export function wordBreakCamelCase(s: string) {
	return s.replace(/([a-z])([A-Z])/g, '$1\u200B$2')
}
