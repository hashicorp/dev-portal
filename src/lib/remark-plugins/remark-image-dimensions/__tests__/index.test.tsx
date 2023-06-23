/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'

import remarkPluginCalculateImageDimensions from '../index'

import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { MdxThemedImage } from 'components/dev-dot-content/mdx-components'

// FIXTURES -----------------------------------------

const source = `
# Hello

How goes it

<ThemedImage
	src={{
        dark: '/img/boundary/boundary-components-min.png',
        light: '/img/boundary/boundary-desktop-cluster-url.png'
    }}
    alt='themed image'
/>
`

const sourceWithAlternatePropOrder = `
# Hello

<ThemedImage
    alt='themed image'
    src={{
     light: '/img/boundary/boundary-desktop-cluster-url.png',
     dark: '/img/boundary/boundary-components-min.png'
    }}
/>
`

const sourceWithWidthHeightOverride = `
# Hello

<ThemedImage
    src={{
        light: '/img/boundary/boundary-desktop-cluster-url.png',
        dark: '/img/boundary/boundary-components-min.png'
    }}
    alt='themed image'
    width='500'
    height='300'
/>
`

const sourceWithAdditionalMdxComponent = `
# Hello

<Tip>Hi</Tip>

<ThemedImage
    alt='themed image'
    src={{
     light: '/img/boundary/boundary-desktop-cluster-url.png',
     dark: '/img/boundary/boundary-components-min.png'
    }}
/>
`

function TestTipComponent({ children }) {
	return <p>{children}</p>
}

const MDX_COMPONENTS = { ThemedImage: MdxThemedImage as any }

// ASSERTIONS -----------------------------------------------------------
describe('themed image dimensions remark plugin', () => {
	it('should rewrite src urls, width, height for previews', async () => {
		process.env.VERCEL_ENV = 'preview'

		const mdxSource = await serialize(source, {
			mdxOptions: {
				remarkPlugins: [remarkPluginCalculateImageDimensions],
			},
		})

		const { container } = render(
			<MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
		)

		expect(container).toMatchInlineSnapshot(`
		<div>
		  <h1>
		    Hello
		  </h1>
		  <p>
		    How goes it
		  </p>
		  <span
		    class="root"
		    data-hide-on-theme="dark"
		  >
		    <img
		      alt="themed image"
		      class="image"
		      data-nimg="1"
		      decoding="async"
		      height="431"
		      loading="lazy"
		      src="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=3840&q=75"
		      srcset="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=1200&q=75 1x, /_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=3840&q=75 2x"
		      style="color: transparent;"
		      width="1192"
		    />
		  </span>
		  <span
		    class="root"
		    data-hide-on-theme="light"
		  >
		    <img
		      alt="themed image"
		      class="image"
		      data-nimg="1"
		      decoding="async"
		      height="431"
		      loading="lazy"
		      src="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=3840&q=75"
		      srcset="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=1200&q=75 1x, /_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=3840&q=75 2x"
		      style="color: transparent;"
		      width="1192"
		    />
		  </span>
		</div>
	`)
	})

	it('should default to plain `img` without width / height 404 if source isnt found', async () => {
		// this .env won't source from the content api, so the
		process.env.VERCEL_ENV = 'development'

		const mdxSource = await serialize(source, {
			mdxOptions: {
				remarkPlugins: [remarkPluginCalculateImageDimensions],
			},
		})

		const { container } = render(
			<MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
		)

		// we expect to fallback to the plain `img` tag, without width and height defined
		expect(container).toMatchInlineSnapshot(`
		<div>
		  <h1>
		    Hello
		  </h1>
		  <p>
		    How goes it
		  </p>
		  <span
		    class="root"
		    data-hide-on-theme="dark"
		  >
		    <img
		      alt="themed image"
		      class="image"
		      src="/img/boundary/boundary-desktop-cluster-url.png"
		    />
		  </span>
		  <span
		    class="root"
		    data-hide-on-theme="light"
		  >
		    <img
		      alt="themed image"
		      class="image"
		      src="/img/boundary/boundary-components-min.png"
		    />
		  </span>
		</div>
	`)
	})

	it('should handle various prop orders', async () => {
		process.env.VERCEL_ENV = 'preview'

		const mdxSource = await serialize(sourceWithAlternatePropOrder, {
			mdxOptions: {
				remarkPlugins: [remarkPluginCalculateImageDimensions],
			},
		})

		const { container } = render(
			<MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
		)

		// we expect to fallback to the plain `img` tag, without width and height defined
		expect(container).toMatchInlineSnapshot(`
		<div>
		  <h1>
		    Hello
		  </h1>
		  <span
		    class="root"
		    data-hide-on-theme="dark"
		  >
		    <img
		      alt="themed image"
		      class="image"
		      data-nimg="1"
		      decoding="async"
		      height="431"
		      loading="lazy"
		      src="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=3840&q=75"
		      srcset="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=1200&q=75 1x, /_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=3840&q=75 2x"
		      style="color: transparent;"
		      width="1192"
		    />
		  </span>
		  <span
		    class="root"
		    data-hide-on-theme="light"
		  >
		    <img
		      alt="themed image"
		      class="image"
		      data-nimg="1"
		      decoding="async"
		      height="431"
		      loading="lazy"
		      src="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=3840&q=75"
		      srcset="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=1200&q=75 1x, /_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=3840&q=75 2x"
		      style="color: transparent;"
		      width="1192"
		    />
		  </span>
		</div>
	`)
	})

	it('should allow width / height to be overridden via props', async () => {
		process.env.VERCEL_ENV = 'preview'

		const mdxSource = await serialize(sourceWithWidthHeightOverride, {
			mdxOptions: {
				remarkPlugins: [remarkPluginCalculateImageDimensions],
			},
		})

		const { container } = render(
			<MDXRemote {...mdxSource} components={MDX_COMPONENTS} />
		)

		// we expect to fallback to the plain `img` tag, without width and height defined
		expect(container).toMatchInlineSnapshot(`
		<div>
		  <h1>
		    Hello
		  </h1>
		  <span
		    class="root"
		    data-hide-on-theme="dark"
		  >
		    <img
		      alt="themed image"
		      class="image"
		      data-nimg="1"
		      decoding="async"
		      height="300"
		      loading="lazy"
		      src="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=1080&q=75"
		      srcset="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=640&q=75 1x, /_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=1080&q=75 2x"
		      style="color: transparent;"
		      width="500"
		    />
		  </span>
		  <span
		    class="root"
		    data-hide-on-theme="light"
		  >
		    <img
		      alt="themed image"
		      class="image"
		      data-nimg="1"
		      decoding="async"
		      height="300"
		      loading="lazy"
		      src="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=1080&q=75"
		      srcset="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=640&q=75 1x, /_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=1080&q=75 2x"
		      style="color: transparent;"
		      width="500"
		    />
		  </span>
		</div>
	`)
	})

	it('only adjusts `ThemedImage` component', async () => {
		process.env.VERCEL_ENV = 'preview'

		const mdxSource = await serialize(sourceWithAdditionalMdxComponent, {
			mdxOptions: {
				remarkPlugins: [remarkPluginCalculateImageDimensions],
			},
		})

		const { container } = render(
			<MDXRemote
				{...mdxSource}
				components={{
					ThemedImage: MdxThemedImage as any,
					Tip: TestTipComponent as any,
				}}
			/>
		)

		// we expect to fallback to the plain `img` tag, without width and height defined
		expect(container).toMatchInlineSnapshot(`
		<div>
		  <h1>
		    Hello
		  </h1>
		  <p>
		    Hi
		  </p>
		  <span
		    class="root"
		    data-hide-on-theme="dark"
		  >
		    <img
		      alt="themed image"
		      class="image"
		      data-nimg="1"
		      decoding="async"
		      height="431"
		      loading="lazy"
		      src="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=3840&q=75"
		      srcset="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=1200&q=75 1x, /_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-desktop-cluster-url.png&w=3840&q=75 2x"
		      style="color: transparent;"
		      width="1192"
		    />
		  </span>
		  <span
		    class="root"
		    data-hide-on-theme="light"
		  >
		    <img
		      alt="themed image"
		      class="image"
		      data-nimg="1"
		      decoding="async"
		      height="431"
		      loading="lazy"
		      src="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=3840&q=75"
		      srcset="/_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=1200&q=75 1x, /_next/image?url=https%3A%2F%2Fcontent.hashicorp.com%2Fapi%2Fassets%3Fproduct%3Dtutorials%26version%3Dmain%26asset%3Dpublic%252Fimg%252Fboundary%252Fboundary-components-min.png&w=3840&q=75 2x"
		      style="color: transparent;"
		      width="1192"
		    />
		  </span>
		</div>
	`)
	})
})
