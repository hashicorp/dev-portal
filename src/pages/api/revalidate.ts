import { NextApiRequest, NextApiResponse } from 'next/types'
import { StatusCodes } from 'http-status-codes'
import { validateToken } from 'lib/api-validate-token'
import { cachedGetProductData } from 'lib/get-product-data'

/**
 * Accepts a POST request with a product slug, triggers revalidation for all of a product's paths
 * specified in its latest nav data.
 */
export default validateToken(
	async function handler(request: NextApiRequest, response: NextApiResponse) {
		if (request.method !== 'POST') {
			response.status(StatusCodes.NOT_FOUND)
			return
		}

		console.log(request.body)
		const { product } = request.body

		if (!product) {
			response
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'No product provided.' })

			return
		}

		const productData = cachedGetProductData(product)

		const navDataPrefixes = productData.rootDocsPaths.map(
			({ navDataPrefix, path }) => {
				return { navDataPrefix, path }
			}
		)

		// fetch the latest nav data, which will be used to construct paths to revalidate
		const navDataFiles = await Promise.all(
			navDataPrefixes.map(({ navDataPrefix, path }) => {
				const prefix = navDataPrefix ?? path

				return fetch(
					`https://content.hashicorp.com/api/content/${product}/nav-data/latest/${prefix}`
				)
					.then((res) => res.json())
					.then(({ result }) => [path, result.navData])
			})
		)

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

		// wait for everything to get revalidated
		await Promise.allSettled(revalidatePromises)

		response.status(200).end()
	},
	{ token: process.env.REVALIDATE_TOKEN, onlyMethods: ['POST'] }
)
