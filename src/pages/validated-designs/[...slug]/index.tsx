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

// @TODO set it up so that the base `hvdSlug` path redirects to the first section page
// for example /validated-designs/terraform-operation-guides-adoption would render the content for
// /validated-designs/terraform-operation-guides-adoption/0000-introduction
export async function getStaticPaths() {
	// @TODO refactor to dynamically build up static paths here for all
	// products/hvds/and hvd section pages based on contents of hvd-docs filesystem
	return {
		paths: [
			{
				params: {
					slug: ['terraform-operation-guides-adoption'],
				},
			},
			{
				params: {
					slug: [
						'terraform-operation-guides-adoption',
						'0000-introduction.mdx',
					],
				},
			},
			{
				params: {
					slug: [
						'terraform-operation-guides-adoption',
						'0010-people-and-process.mdx',
					],
				},
			},
			{
				params: {
					slug: [
						'terraform-operation-guides-adoption',
						'0020-consumption-models.mdx',
					],
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
