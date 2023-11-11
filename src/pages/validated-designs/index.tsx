/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import path from 'path'
import { HVD_CONTENT_DIR } from '../../../scripts/extract-hvd-content'

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

	/**
	 * Get the data from /.extracted/*
	 * Walk the products
	 * Get the hvds
	 */
	return {
		props: {},
	}
}
