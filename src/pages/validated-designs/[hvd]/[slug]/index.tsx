/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'

export default function ValidatedDesignPageTemplate() {
	return (
		<>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<h1>HashiCorp Validated Design Page Template</h1>
		</>
	)
}

export async function getStaticPaths() {
	// @TODO build up static paths here for all products/hvds/and hvd section pages
	return {
		paths: [
			{
				params: {
					hvd: 'terraform-operation-guides-adoption',
					slug: '0000-introduction.mdx',
				},
			},
		],
		fallback: false,
	}
}

export async function getStaticProps() {
	if (__config.flags.enable_hvd === false) {
		return {
			notFound: true,
		}
	}
	return {
		props: {},
	}
}
