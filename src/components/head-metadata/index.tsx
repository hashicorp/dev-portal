/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useRouter } from 'next/router'
import HashiHead from '@hashicorp/react-head'
import { useCurrentProduct } from 'contexts'
import getDeployedUrl from 'lib/get-deployed-url'
import { HeadMetadataProps } from './types'

/**
 * Returns the fully qualified developer URL for the current page, minus the query string
 *
 * TODO: If we want to support specific query params in the canonical, consider adding an allow list here and instead filtering the search params based on that
 */
const useFullUrl = (base: string = __config.dev_dot.canonical_base_url) => {
	const { asPath } = useRouter()
	const url = new URL(asPath, base)

	// remove any query params from the URL to ensure they don't end up in the canonical
	url.search = ''

	return url.toString()
}

/**
 * Builds up the the necessary meta tags for the site. Rendered in `_app`, where it receives `pageProps.metadata` as props
 *
 * We build up a page title that looks like {props.title} | {currentProduct} | {root title}
 */
export default function HeadMetadata(props: HeadMetadataProps) {
	const { name: productName, slug: productSlug } = useCurrentProduct() ?? {}
	// Use the fully qualified current page URL as the canonical URL
	const canonicalUrl = useFullUrl()

	const titleParts = [__config.dev_dot.meta.title]
	const description = props.description ?? __config.dev_dot.meta.description

	// We're using .unshift() to add the following elements to the beginning of the array
	if (productName) {
		titleParts.unshift(productName)
	}

	if (props.title) {
		titleParts.unshift(props.title)
	}

	const title = titleParts.join(' | ')

	const finalDescription = description.replace(
		'{product}',
		productName ?? 'HashiCorp'
	)

	const ogImagePath = props.localOgImage || `${productSlug ?? 'base'}.jpg`
	const ogImageUrl = `${getDeployedUrl()}/og-image/${ogImagePath}`

	return (
		// TODO: OpenGraph image to be passed as the image prop here
		<HashiHead
			title={title}
			siteName={title}
			pageName={title}
			description={finalDescription}
			image={ogImageUrl}
			canonicalUrl={canonicalUrl}
		>
			<link
				rel="icon"
				href={
					process.env.NODE_ENV !== 'production'
						? '/favicon-dev.ico'
						: '/favicon.ico'
				}
				sizes="any"
			/>
			<link rel="icon" href="/icon.svg" type="image/svg+xml" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta
				name="google-site-verification"
				content="zRQZqfAsOX-ypXfU0mzAIzb5rUvj5fA4Zw2jWJRN-JI"
			/>
			{/**
			 * Note that `key` values here are necessary, as NextJS de-dupes
			 * `meta` tags based on `name`.
			 * Ref: https://github.com/vercel/next.js/pull/17099
			 *
			 * We have one zd crawler for each product
			 */}

			<meta
				name="zd-site-verification"
				key="xnvnvv1i0wl4tf0pzaymb"
				content="xnvnvv1i0wl4tf0pzaymb"
				data-product="hcp"
			/>
			<meta
				name="zd-site-verification"
				key="36fp2i1pj67d8cjtzf4fi9"
				content="36fp2i1pj67d8cjtzf4fi9"
				data-product="terraform"
			/>
			<meta
				name="zd-site-verification"
				key="nbe87kfyp1sck7b13vj1i"
				content="nbe87kfyp1sck7b13vj1i"
				data-product="packer"
			/>
			<meta
				name="zd-site-verification"
				key="wvsmmqa1cfb9am9zlwfj"
				content="wvsmmqa1cfb9am9zlwfj"
				data-product="consul"
			/>
			<meta
				name="zd-site-verification"
				key="cw22oopfwr68ujj0n5pn9i"
				content="cw22oopfwr68ujj0n5pn9i"
				data-product="boundary"
			/>
			<meta
				name="zd-site-verification"
				key="lkslvganwfgfqfwpdeicgh"
				content="lkslvganwfgfqfwpdeicgh"
				data-product="vault"
			/>
			<meta
				name="zd-site-verification"
				key="jl2wp2hoej9rz6c8rmqdns"
				content="jl2wp2hoej9rz6c8rmqdns"
				data-product="nomad"
			/>
			<meta
				name="zd-site-verification"
				key="2eb0cu6xceo73t0038m0tb"
				content="2eb0cu6xceo73t0038m0tb"
				data-product="waypoint"
			/>
			<meta
				name="zd-site-verification"
				key="n52xisxdf3higs2q9kuogd"
				content="n52xisxdf3higs2q9kuogd"
				data-product="vagrant"
			/>

			{/* Some og tags do not get picked up for twitter's share cards, so we need these tags as well */}
			<meta name="twitter:image" key="twitter:image" content={ogImageUrl} />
		</HashiHead>
	)
}
