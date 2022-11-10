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

/**
 * This generates {@link [../src/.generated/opt-in-redirect-checks.js](../src/.generated/opt-in-redirect-checks.js)}
 * which is .gitignore'd, so it may not appear in grep results.
 *
 * This will contain a dictionary of `{[productslug]: RegExp}`
 */
export default async function main() {
	const result = ['export default {']

	activeProductSlugs.forEach((productSlug) => {
		if (productSlug === 'hcp' || productSlug === 'terraform') {
			return false
		}

		const { basePaths } = cachedGetProductData(productSlug)

		result.push(`\t${productSlug}: /^\\/(${basePaths.join('|')})\\/?/,`)
	})

	result.push(`}`)

	await fs.promises.mkdir(path.join(process.cwd(), 'src', '.generated'), {
		recursive: true,
	})

	console.log(`📝 Writing generated opt-in redirect checks to ${filePath}`)
	const fileContent = result.join('\n') + '\n'
	if (process.env.DEBUG_REDIRECTS) {
		console.log('[DEBUG_REDIRECTS]', fileContent)
	}

	fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' })
}

main()
