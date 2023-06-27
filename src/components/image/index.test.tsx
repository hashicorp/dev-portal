/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'

import { rewriteStaticAssetsPlugin } from 'lib/remark-plugins/rewrite-static-tutorials-assets'

import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Image from 'components/image'

// FIXTURES -----------------------------------------

const source = `
# Hello

How goes it

![dark theme](/img/themed/dark-test.png#hide-on-light)
![light theme](/img/themed/light-test.png#hide-on-dark)

![another image](/img/something.jpg)
`

const MDX_COMPONENTS = { img: Image as any }
const SERIALIZE_OPTIONS = {
	mdxOptions: {
		remarkPlugins: [rewriteStaticAssetsPlugin],
	},
}

// ASSERTIONS -----------------------------------------------------------

describe('image component', () => {
	it('should add data-hide-on-theme attribute when theme hash is passed', async () => {
		const mdxSource = await serialize(source, SERIALIZE_OPTIONS)
		const { container } = render(
			<MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
		)

		expect(
			container.querySelector('[data-hide-on-theme="dark"]')
		).toBeInTheDocument()
		expect(
			container.querySelector('[data-hide-on-theme="light"]')
		).toBeInTheDocument()
	})

	it('renders a plain image without the data-hide-on-theme attribute ', async () => {
		const mdxSource = await serialize(source, SERIALIZE_OPTIONS)
		const { getByAltText } = render(
			<MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
		)

		expect(getByAltText('another image')).toBeInTheDocument()
		expect(getByAltText('another image')).not.toHaveAttribute(
			'data-hide-on-theme'
		)
	})
})
