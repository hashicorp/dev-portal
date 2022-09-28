import fs from 'fs'
import path from 'path'
// import { unflatten } from 'flat'
// import { loadHashiConfigForEnvironment } from '../config'
import { cachedGetProductData } from 'lib/get-product-data'
import { productSlugs } from 'lib/products'

// const __config = unflatten(loadHashiConfigForEnvironment())

const filePath = path.join(
	process.cwd(),
	'src',
	'.generated',
	'opt-in-redirects.js'
)

export default async function main() {
	const result = ['export default {']

	productSlugs.forEach((productSlug) => {
		if (productSlug === 'hcp' || productSlug === 'terraform') {
			return false
		}

		const { basePaths } = cachedGetProductData(productSlug)

		result.push(`\t'${productSlug}': /^\\/${basePaths.join('|')}\\/?/,`)
	})

	result.push(`}`)

	await fs.promises.mkdir(path.join(process.cwd(), 'src', '.generated'), {
		recursive: true,
	})

	fs.writeFileSync(filePath, result.join('\n') + '\n', { encoding: 'utf-8' })

	console.log(result.join('\n'))
}

main()
