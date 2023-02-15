/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import moize from 'moize'
import { ProductData, ProductSlug } from 'types/products'

function getProductData(product: ProductSlug): ProductData {
	try {
		const productData = JSON.parse(
			fs.readFileSync(
				path.join(process.cwd(), `src/data/${product}.json`),
				'utf-8'
			)
		)
		return productData
	} catch (e) {
		console.error(
			`[Error]: unable to fetch product data for ${product} — ${e.message}`
		)
		throw e
	}
}

export const cachedGetProductData = moize(getProductData)
