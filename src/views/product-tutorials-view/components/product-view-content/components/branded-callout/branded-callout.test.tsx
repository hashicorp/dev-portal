/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'
import { ProductOption } from 'lib/learn-client/types'
import { BrandedCallout } from './index'

// Mock next/image since `src` is stubbed with an invalid path
vi.mock('next/image', () => {
	return {
		__esModule: true,
		default: ({ src, alt }) => {
			return <img {...{ src, alt }} />
		},
	}
})

describe('BrandedCallout', () => {
	it.each([
		// prettier-ignore
		['https://www.hashicorp.com/blog/hashicorp-boundary-0-7', '_blank', 'noreferrer noopener'],
		['http://localhost', null, null],
		['/some/local/path', null, null],
	])('should handle external & internal links', (url, target, rel) => {
		vi.stubGlobal('location', { origin: 'http://localhost' })
		const { getByRole } = render(
			<BrandedCallout
				heading="Heading"
				subheading="Subheading"
				product={ProductOption.boundary}
				cta={{
					text: 'CTA Text',
					url: url,
				}}
			/>
		)

		// This is a bit of an integration test with `StandaloneLink`
		const cta = getByRole('link')
		if (target) {
			expect(cta).toHaveAttribute('target', target)
		} else {
			expect(cta).not.toHaveAttribute('target')
		}

		// conditional assertion
		if (rel) {
			expect(cta).toHaveAttribute('rel', rel)
		} else {
			expect(cta).not.toHaveAttribute('rel')
		}
	})
})
