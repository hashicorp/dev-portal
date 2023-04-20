/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import guaranteeUniqueSlug from './guarantee-unique-slug'

describe('guaranteeUniqueSlug', () => {
	it('returns a slugified version of the provided string', () => {
		const result = guaranteeUniqueSlug('Hello World', [])
		expect(result).toBe('hello-world')
	})
})
