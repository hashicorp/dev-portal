import { render } from '@testing-library/react'

import { remarkTfeContentExclusion } from '../index'

import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

describe('remark-tfe-content-exclusion', () => {
	it('should render helper elements', async () => {
		const source = `
# Hello
<!-- BEGIN: TFC:only -->
Here is some content that should only ever be displayed for TFC
<!-- END:   TFC:only -->`

		const mdxSource = await serialize(source, {
			mdxOptions: {
				// @ts-expect-error - typing is not quite accurate
				remarkPlugins: [[remarkTfeContentExclusion, { version: 'latest' }]],
			},
		})

		const { container, getByText } = render(<MDXRemote {...mdxSource} />)
		expect(getByText(/BEGIN:\s+TFC:only/i)).toBeInTheDocument()
		expect(getByText(/END:\s+TFC:only/i)).toBeInTheDocument()

		expect(container).toMatchInlineSnapshot(`
		<div>
		  <h1>
		    Hello
		  </h1>
		  <div
		    class="content_exclusion begin"
		  >
		    <div
		      class="content_exclusion_inner"
		    >
		       BEGIN: TFC:only 
		    </div>
		  </div>
		  <p>
		    Here is some content that should only ever be displayed for TFC
		  </p>
		  <div
		    class="content_exclusion end"
		  >
		    <div
		      class="content_exclusion_inner"
		    >
		       END:   TFC:only 
		    </div>
		  </div>
		</div>
	`)
	})
})
