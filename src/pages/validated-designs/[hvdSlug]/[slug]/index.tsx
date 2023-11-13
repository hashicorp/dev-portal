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
	// @TODO refactor to dynamically build up static paths here for all
	// products/hvds/and hvd section pages based on contents of hvd-docs filesystem
	return {
		paths: [
			{
				params: {
					hvdSlug: 'terraform-operation-guides-adoption',
					slug: '0000-introduction.mdx',
				},
			},
			{
				params: {
					hvdSlug: 'terraform-operation-guides-adoption',
					slug: '0010-people-and-process.mdx',
				},
			},
			{
				params: {
					hvdSlug: 'terraform-operation-guides-adoption',
					slug: '0020-consumption-models.mdx',
				},
			},
		],
		fallback: false,
	}
}

export async function getStaticProps() {
	/** TODO remove this conditional after release */
	if (__config.flags.enable_hvd === false) {
		return {
			notFound: true,
		}
	}
	return {
		props: {},
	}
}
