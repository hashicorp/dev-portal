/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'

/**
 * Given an operation ID, return a slugified version of it.
 *
 * This function has been abstracted as it's important for all instances
 * of slugify-ing operation IDs to function in exactly the same way,
 * as they're used for generating and then later matching URLs for
 * individual operation pages.
 *
 * @param operationId
 * @returns
 */
export function slugifyOperationId(operationId: string): string {
	return slugify(operationId, { lower: true })
}
