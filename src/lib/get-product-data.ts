import fs from 'fs'
import path from 'path'
import moize from 'moize'
import { ProductData, ProductSlug } from 'types/products'

function getProductData(productSlug: ProductSlug): ProductData {
	try {
		const productData = JSON.parse(
			fs.readFileSync(
				path.join(process.cwd(), `src/data/${productSlug}.json`),
				'utf-8'
			)
		)
		return productData
	} catch (e) {
		console.error(
			`[Error]: unable to fetch product data for ${productSlug} — ${e.message}`
		)
		throw e
	}
}

export const cachedGetProductData = moize(getProductData)
