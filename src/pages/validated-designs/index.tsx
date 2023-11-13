/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'

export default function ValidatedDesignsLanding() {
	return (
		<>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<h1>HashiCorp Validated Designs</h1>
		</>
	)
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
