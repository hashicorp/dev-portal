/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { truncateHcpOperationPath } from './truncate-hcp-operation-path'
import type { OperationObject } from './get-operation-objects'

/**
 * Given an operation object, derive a string representing the
 * first two segments of the operation's path, and
 * Return the string for use in grouping the operation with other
 * operations that share the first two path segments.
 */
export function getOperationGroupKeyFromPath(o: OperationObject) {
	const truncatedPath = truncateHcpOperationPath(o.path)
	return truncatedPath.split('/').slice(0, 3).join('/')
}
