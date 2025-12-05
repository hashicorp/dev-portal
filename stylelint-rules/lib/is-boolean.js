/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Determines if the given value is a boolean.
 */
module.exports = (value) => {
	return typeof value === 'boolean' || value instanceof Boolean
}
