/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'

/**
 * Return a slugified version of the provided variable group name
 */
export function getVariableGroupSlug(name: string) {
	return slugify(name, { lower: true })
}

/**
 * Given a unique variable group name, and a variable key,
 * Return a slug identifier for the variable
 */
export function getVariableSlug(
	groupName: string,
	variableKey: string
): string {
	return `${getVariableGroupSlug(groupName)}.${variableKey}`
}
