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
        dark: 'img/boundary/boundary-components-min.png',
        light: 'img/boundary/boundary-desktop-cluster-url.png'
    }}
    alt=''
    width='500'
    height='300'
/>
`

		const mdxSource = await serialize(source, {
			mdxOptions: {
				remarkPlugins: [remarkPluginCalculateImageDimensions],
			},
		})

		const { container, getByText } = render(
			<MDXRemote {...mdxSource} components={{ ThemedImage: MdxThemedImage }} />
		)

		// 	expect(container).toMatchInlineSnapshot(`
		// 	<div>
		// 	  <h1>
		// 	    Hello
		// 	  </h1>
		// 	  <p>
		// 	    How goes it
		// 	  </p>
		// 	</div>
		// `)
	})
})
