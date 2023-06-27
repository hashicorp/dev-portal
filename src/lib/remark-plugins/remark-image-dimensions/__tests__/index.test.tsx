/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Image from 'components/image'
import { remarkPluginInjectImageDimensions } from '..'

// FIXTURES -----------------------------------------

const MDX_COMPONENTS = { img: Image as any }
const SERIALIZE_OPTIONS = {
	mdxOptions: {
		remarkPlugins: [remarkPluginInjectImageDimensions],
	},
}
const probeDimensions = { width: '500', height: '300' }
const alt = 'image test'

// Mock the external call to get dimensions
jest.mock('probe-image-size', () => {
	return jest.fn(() => {
		return probeDimensions
	})
})

// ASSERTIONS -----------------------------------------------------------

describe('remarkPluginInjectImageDimensions', () => {
	it('wont add width / height if no protocol in src', async () => {
		const source = `
![${alt}](/img/themed/test.png)
`
		const mdxSource = await serialize(source, SERIALIZE_OPTIONS)
		const { getByAltText } = render(
			<MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
		)
		const img = getByAltText(alt)

		expect(img).not.toHaveAttribute('width')
		expect(img).not.toHaveAttribute('height')
	})

	it('returns dimensions from probe function when url has protocol', async () => {
		const source = `
![${alt}](https://content.hashicorp.com/api/assets/img/themed/test-placeholder.png)
`
		const mdxSource = await serialize(source, SERIALIZE_OPTIONS)
		const { getByAltText } = render(
			<MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
		)
		const img = getByAltText(alt)

		expect(img).toHaveAttribute('width', probeDimensions.width)
		expect(img).toHaveAttribute('height', probeDimensions.height)
	})

	it('rewrites width / height when theme hash is passed', async () => {
		const source = `
![${alt}](https://content.hashicorp.com/api/assets/img/themed/test.png#hide-on-dark)
`
		const mdxSource = await serialize(source, SERIALIZE_OPTIONS)
		const { getByAltText } = render(
			<MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
		)
		const img = getByAltText(alt)

		expect(img).toHaveAttribute('width', probeDimensions.width)
		expect(img).toHaveAttribute('height', probeDimensions.height)
	})
})
