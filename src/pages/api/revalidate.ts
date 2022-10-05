import type { NextApiRequest, NextApiResponse } from 'next/types'
import { StatusCodes } from 'http-status-codes'
import { validateToken } from 'lib/api-validate-token'
import { cachedGetProductData } from 'lib/get-product-data'

/**
 * Accepts a POST request with a product slug, triggers revalidation for all of a product's docs paths
 * specified in its latest nav data.
 */
async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method !== 'POST') {
		response.status(StatusCodes.NOT_FOUND)
		return
	}

	const { product } = request.body

	if (!product) {
		response
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'No product provided.' })

		return
	}

	const productData = cachedGetProductData(product)

	const navDataPrefixes = productData.rootDocsPaths.map(
		({ navDataPrefix, path, productSlugForLoader }) => {
			return { navDataPrefix, path, productSlugForLoader }
		}
	)

	// fetch the latest nav data, which will be used to construct paths to revalidate
	const navDataFiles = (
		await Promise.all(
			navDataPrefixes.map(
				async ({ navDataPrefix, path, productSlugForLoader = product }) => {
					const prefix = navDataPrefix ?? path

					const response = await fetch(
						`https://content.hashicorp.com/api/content/${productSlugForLoader}/nav-data/latest/${prefix}`
					)
					const { result } = await response.json()

					if (!result.navData) {
						console.log(
							`[revalidate] failed to find nav data for path: ${path}. It is possible that this path does not have nav data, this is likely safe to ignore.`
						)
						return false
					}

					return [path, result.navData]
				}
			)
		)
	).filter(Boolean) as any[]

	const revalidatePromises = []

	// iterates through nav data recursively and creates a revalidate request
	function revalidateNavNodes(basePath, nodes) {
		nodes.forEach(({ path, routes }) => {
			if (routes) {
				revalidateNavNodes(basePath, routes)
				return
			}

			if (path) {
				const pathToRevalidate = `/${product}/${basePath}/${path}`

				console.log('[revalidate]', pathToRevalidate)
				revalidatePromises.push(response.revalidate(pathToRevalidate))
			}
		})
	}

	// iterate over each nav node and revalidate its path
	navDataFiles.forEach(([basePath, navData]) => {
		revalidateNavNodes(basePath, navData)
	})

	// TODO(brkalow): Add resiliency here, this has the potential to send off hundreds of calls depending on the product, so we should think about how we want to handle network hiccups or partial failure.
	// wait for everything to get revalidated
	await Promise.allSettled(revalidatePromises)

	response.status(200).end()
}

export default validateToken(handler, {
	token: process.env.REVALIDATE_TOKEN,
	onlyMethods: ['POST'],
})
