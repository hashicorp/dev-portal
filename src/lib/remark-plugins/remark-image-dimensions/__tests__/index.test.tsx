/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'

import remarkPluginCalculateImageDimensions from '../index'

import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { MdxThemedImage } from 'components/dev-dot-content/mdx-components'

describe('remark-tfe-content-exclusion', () => {
	it('should render helper elements', async () => {
		const source = `
# Hello

How goes it

<ThemedImage
	src={{
        dark: 'img/get-started-dark.png',
        light: 'img/get-started-light.png'
    }}
    alt=''
    width='500'
    height='300'
/>
`

		const mdxSource = await serialize(source, {
			mdxOptions: {
				remarkPlugins: [[remarkPluginCalculateImageDimensions]],
			},
		})

		const { container, getByText } = render(
			<MDXRemote {...mdxSource} components={{ ThemedImage: MdxThemedImage }} />
		)
		expect(getByText(/BEGIN:\s+TFC:only/i)).toBeInTheDocument()
		expect(getByText(/END:\s+TFC:only/i)).toBeInTheDocument()

		expect(container).toMatchInlineSnapshot(`
		<div>
		  <h1>
		    Hello
		  </h1>
		  <p>
		    How goes it
		  </p>
		</div>
	`)
	})
})
