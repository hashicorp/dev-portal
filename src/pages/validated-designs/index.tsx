/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import path from 'path'
import fs from 'fs'

// TODO create an alias for root dir
import { HVD_CONTENT_DIR } from '../../../scripts/extract-hvd-content'

const tmp_HVD_CONTENT_DIR_TF = `${HVD_CONTENT_DIR}/hvd-docs/terraform`

export default function ValidatedDesignsLanding({ data }: { data: $TSFixMe }) {
	console.log({ data })
	return (
		<>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<h1>HashiCorp Validated Designs</h1>
			<ul>
				{data.map((file, i) => (
					<li key={i}>
						<a href={file.path}>{file.path} </a>
					</li>
				))}
			</ul>
		</>
	)
}

function getHvdData() {
	// @TODO refactor to support all products based on Products type src/types/products.ts
	const terraformHvdDir = fs.readdirSync(
		`${HVD_CONTENT_DIR}/hvd-docs/terraform`,
		{
			recursive: true,
		}
	)
	console.log({ terraformHvdDir })
	const files = []
	terraformHvdDir.map((_path) => {
		if (_path.endsWith('.mdx')) {
			const fileData = fs.readFileSync(
				path.join(tmp_HVD_CONTENT_DIR_TF, _path),
				{ encoding: 'utf-8' }
			)
			// @TODO swap with the product dir
			const product = 'terraform'
			const [category, hvdName, hvdSectionFile] = _path.split('/')
			const hvdSectionPath = `/validated-designs/${product}-${category}-${hvdName}/${hvdSectionFile}`
			files.push({ path: hvdSectionPath, data: JSON.stringify(fileData) })
		}
	})

	return files
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
	const data = getHvdData()

	return {
		props: { data },
	}
}
