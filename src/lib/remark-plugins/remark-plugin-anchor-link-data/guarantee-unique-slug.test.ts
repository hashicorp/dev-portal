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

	it('returns a unique version of the provided string if a conflicting slug already exists', () => {
		const result = guaranteeUniqueSlug('Hello World', ['hello-world'])
		expect(result).toBe('hello-world-1')
	})

	it('properly handles multiple duplicates', () => {
		const result = guaranteeUniqueSlug('Hello World', [
			'hello-world',
			'hello-world-1',
		])
		expect(result).toBe('hello-world-2')
	})
})
