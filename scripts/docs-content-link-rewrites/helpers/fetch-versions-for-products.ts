import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { productSlugs } from 'lib/products'
import { cachedGetProductData } from 'lib/get-product-data'

const fetchVersionsForProducts = async ({ generatedFilesFolderPath }) => {
	const generatedFolder = generatedFilesFolderPath
	if (!fs.existsSync(generatedFolder)) {
		fs.mkdirSync(generatedFolder)
	}

	const outputFolder = path.join(generatedFolder, 'versions')
	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder)
	}

	const slugs = new Set()
	productSlugs.forEach((productSlug) => {
		if (productSlug === 'sentinel') {
			return
		}

		const productData = cachedGetProductData(productSlug)
		const rootDocsPaths = productData.rootDocsPaths
		rootDocsPaths.forEach((rootDocsPath) => {
			const slugForLoader = rootDocsPath.productSlugForLoader ?? productSlug
			slugs.add(slugForLoader)
		})
	})

	await Promise.all(
		Array.from(slugs).map((slug: string) => {
			const url = `${process.env.MKTG_CONTENT_API}/api/content/${slug}/version-metadata?partial=true`
			return fetch(url)
				.then((res) => res.json())
				.then(({ result }) => {
					const outputFilePath = path.join(outputFolder, `${slug}.json`)
					fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2))
				})
		})
	)
}

export default fetchVersionsForProducts
