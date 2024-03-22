/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { makeHeadingSlugScope } from '../make-heading-slug-scope'

describe('makeHeadingSlugScope', () => {
	test('returns already-unique headings unmodified', () => {
		const makeHeadingSlug = makeHeadingSlugScope()
		expect(makeHeadingSlug('Foo Heading')).toBe('foo-heading')
		expect(makeHeadingSlug('Bar Heading')).toBe('bar-heading')
		expect(makeHeadingSlug('Baz Heading')).toBe('baz-heading')
	})

	test('appends duplicate headings with an index', () => {
		const makeHeadingSlug = makeHeadingSlugScope()
		expect(makeHeadingSlug('Foo Heading')).toBe('foo-heading')
		expect(makeHeadingSlug('Foo Heading')).toBe('foo-heading-2')
		expect(makeHeadingSlug('Foo headinG')).toBe('foo-heading-3')
	})

	test('detects duplicates within specific scopes', () => {
		const makeHeadingSlugScope1 = makeHeadingSlugScope()
		const makeHeadingSlugScope2 = makeHeadingSlugScope()
		expect(makeHeadingSlugScope1('Foo Heading')).toBe('foo-heading')
		expect(makeHeadingSlugScope2('Foo Heading')).toBe('foo-heading')
	})
})
