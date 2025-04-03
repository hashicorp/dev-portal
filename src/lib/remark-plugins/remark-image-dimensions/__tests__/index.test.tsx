/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'
import { MDXRemote } from 'lib/next-mdx-remote'
import { serialize } from 'lib/next-mdx-remote/serialize'
import Image from 'components/image'
import { remarkPluginInjectImageDimensions, getUrlWithDimensions } from '..'

const probeDimensions = { width: '500', height: '300' }

// Mock the external call to get dimensions
vi.mock('probe-image-size', () => {
	return {
		default: vi.fn(() => {
			return probeDimensions
		}),
	}
})

describe('remarkPluginInjectImageDimensions', () => {
	it('does not rewrite if non-mktg-content-api url', async () => {
		const imgSrc = `https://placehold.co/600x400/pink/FFF`
		const alt = 'image alt'
		const source = `
![${alt}](${imgSrc})
`
		const mdxSource = await serialize(source, {
			mdxOptions: {
				remarkPlugins: [remarkPluginInjectImageDimensions],
			},
		})
		const { getByAltText } = render(
			<MDXRemote {...mdxSource} components={{ img: Image as $TSFixMe }} />
		)
		const img = getByAltText(alt)

		expect(img).not.toHaveAttribute('width')
		expect(img).not.toHaveAttribute('height')
		expect(img).toHaveAttribute('src', imgSrc)
	})

	it('does not rewrite if width/ height already defined', async () => {
		const src = `https://content.hashicorp.com/api/assets/img/themed/test-placeholder.png?width=700&height=700`
		const url = await getUrlWithDimensions(src)

		expect(url).toEqual(src)
	})

	it('adds dimensions to src url', async () => {
		const src = `https://content.hashicorp.com/api/assets/img/themed/test-placeholder.png`
		const url = await getUrlWithDimensions(src)

		expect(url).toContain(`width=${probeDimensions.width}`)
		expect(url).toContain(`height=${probeDimensions.height}`)
	})

	it('passes through hash to src url', async () => {
		const src = `https://content.hashicorp.com/api/assets/img/themed/test.png#hide-on-dark`
		const url = await getUrlWithDimensions(src)

		expect(url).toContain(`width=${probeDimensions.width}`)
		expect(url).toContain(`height=${probeDimensions.height}`)
		expect(url).toContain(`#hide-on-dark`)
	})
})
