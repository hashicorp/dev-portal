import fs from 'fs'
import path from 'path'
import { cachedGetProductData } from 'lib/get-product-data'
import { activeProductSlugs } from 'lib/products'

const filePath = path.join(
	process.cwd(),
	'src',
	'.generated',
	'opt-in-redirect-checks.js'
)

export default async function main() {
	const result = ['export default {']

	activeProductSlugs.forEach((productSlug) => {
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

	console.log(`📝 Writing generated opt-in redirect checks to ${filePath}`)
	fs.writeFileSync(filePath, result.join('\n') + '\n', { encoding: 'utf-8' })
}

main()
