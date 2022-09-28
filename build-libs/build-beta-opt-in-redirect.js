const fs = require('fs')
const path = require('path')
const { unflatten } = require('flat')
const { loadHashiConfigForEnvironment } = require('../config')
const proxySettings = require('./proxy-settings')

/**
 * c.f. src/lib/get-product-data.ts
 *
 * This script runs separate from a build step, so we can't import TS here
 */
function getProductData(product) {
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

const __config = unflatten(loadHashiConfigForEnvironment())

/**
 * Construct a redirect definition for beta product opt-in, based on cookies and host conditions
 *
 * @returns {Redirect} redirect
 */
function buildBetaProductOptInRedirect() {
	return __config.dev_dot.beta_product_slugs
		.map((product) => {
			if (product === 'hcp' || product === 'terraform') {
				return false
			}
			const { basePaths } = getProductData(product)
			return {
				source: `/:base(${basePaths.join('|')})/:path*`,
				destination: `${__config.dev_dot.canonical_base_url}/${product}/:base/:path*`,
				permanent: false,
				has: [
					{
						type: 'cookie',
						key: `${product}-io-beta-opt-in`,
						value: 'true',
					},
					{
						type: 'host',
						value: proxySettings[product].host,
					},
				],
			}
		})
		.filter(Boolean)
}

module.exports = buildBetaProductOptInRedirect
