import { render } from '@testing-library/react'
import { ProductOption } from 'lib/learn-client/types'
import { BrandedCallout } from './index'

// Mock next/image since `src` is stubbed with an invalid path
jest.mock('next/image', () => {
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
		['http://localhost', '_self', null],
		['/some/local/path', '_self', null],
	])('should handle external & internal links', (url, target, rel) => {
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
		expect(cta).toHaveAttribute('target', target)

		// conditional assertion
		if (rel) {
			expect(cta).toHaveAttribute('rel', rel)
		} else {
			expect(cta).not.toHaveAttribute('rel')
		}
	})
})
