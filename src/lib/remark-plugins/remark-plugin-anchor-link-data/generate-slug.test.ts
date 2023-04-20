/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import generateSlug from './generate-slug'

describe('generateSlug', () => {
	it('returns a slugified version of the provided string', () => {
		const result = generateSlug('Hello World', [])
		expect(result).toBe('hello-world')
	})

	it('returns a unique version of the provided string if a conflicting slug already exists', () => {
		const allSlugs = []
		const result1 = generateSlug('Hello World', allSlugs)
		const result2 = generateSlug('Hello World', allSlugs)
		expect(result1).toBe('hello-world')
		expect(result2).toBe('hello-world-1')
	})

	it('properly handles multiple duplicates', () => {
		const allSlugs = []
		const result1 = generateSlug('Hello World', allSlugs)
		const result2 = generateSlug('Hello World', allSlugs)
		const result3 = generateSlug('Hello World', allSlugs)
		expect(result1).toBe('hello-world')
		expect(result2).toBe('hello-world-1')
		expect(result3).toBe('hello-world-2')
	})

	it('properly handles edge case conflicts', () => {
		const allSlugs = []
		const result1 = generateSlug('step', allSlugs)
		const result2 = generateSlug('step', allSlugs)
		const result3 = generateSlug('step 1', allSlugs)
		expect(result1).toBe('step')
		expect(result2).toBe('step-1')
		expect(result3).toBe('step-1-1')
	})
})
