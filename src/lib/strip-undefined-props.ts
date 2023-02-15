/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Hack needed to avoid JSON-Serialization validation error from Next.js.
 * https://github.com/zeit/next.js/discussions/11209
 *
 * Reason: `undefined` cannot be serialized as JSON.
 * Please use `null` or omit this value all together.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stripUndefinedProperties<T = any>(obj: T): T {
	return JSON.parse(JSON.stringify(obj))
}
