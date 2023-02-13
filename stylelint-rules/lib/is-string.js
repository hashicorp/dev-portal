/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Determines if the given value is a string.
 */
module.exports = (value) => {
	return typeof value === 'string' || value instanceof String
}
