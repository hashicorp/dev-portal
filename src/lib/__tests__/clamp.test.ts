/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import clamp from '../clamp'

describe('clamp', () => {
	it('throws an error if max is less than min', () => {
		expect(() => clamp(150, 200, 100)).toThrowError()
	})

	it('returns num if between min and max', () => {
		expect(clamp(150, 100, 200)).toBe(150)
	})

	it('returns min if num is less than min', () => {
		expect(clamp(0, 100, 150)).toBe(100)
	})

	it('returns max if num is greater than max', () => {
		expect(clamp(150, 0, 100)).toBe(100)
	})
})
