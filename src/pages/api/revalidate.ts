/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { NextApiRequest, NextApiResponse } from 'next/types'
import { StatusCodes } from 'http-status-codes'
import { validateToken } from 'lib/api-validate-token'
import { cachedGetProductData } from 'lib/get-product-data'
import { ProductSlug } from 'types/products'

/**
 * Resolves the product slug based on the given product name.
 *
 * @param product - The name of the product.
 * @returns The corresponding product slug.
 */
export function resolveProduct(product: string): ProductSlug {
	// Handle TF's sub-projects
	if (product.startsWith('terraform-') || product === 'ptfe-releases') {
		return 'terraform'
	} else if (product === 'hcp-docs') {
		return 'hcp'
	} else {
		return product as ProductSlug
	}
}

/**
 * @TODO move this into the /api/revalidate dir and update the filename to something like 'docs'
 * https://app.asana.com/0/1202097197789424/1204094036463681
 *
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

	const resolvedProduct = resolveProduct(product)
	const productData = cachedGetProductData(resolvedProduct)

	const navDataPrefixes = productData.rootDocsPaths.map(
		({ navDataPrefix, path, productSlugForLoader }) => {
			return { navDataPrefix, path, productSlugForLoader }
		}
	)

	// fetch the latest nav data, which will be used to construct paths to revalidate
	const navDataFiles = (
		await Promise.all(
			navDataPrefixes.map(
				async ({ navDataPrefix, path, productSlugForLoader }) => {
					// Only re-validate a TF sub-project's paths
					// We set resolvedProduct to `terraform`, but product will be one of the sub-project slugs
					if (product !== resolvedProduct && productSlugForLoader !== product) {
						return false
					}

					// Default productSlugForLoader to `product` if undefined
					productSlugForLoader ||= product

					const prefix = navDataPrefix ?? path

					const response = await fetch(
						`https://content.hashicorp.com/api/content/${productSlugForLoader}/nav-data/latest/${prefix}`
					)
					const { result } = await response.json()

					if (!result || !result.navData) {
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

			if (typeof path !== 'undefined') {
				const pathToRevalidate = `/${resolvedProduct}/${basePath}/${path}`
					// remove any trailing slash
					.replace(/\/$/, '')

				revalidatePromises.push(
					new Promise<{}>((resolve, reject) => {
						// revalidate() returns Promise<void>, so we wrap it in another promise to resolve with the path that it is revalidating
						response
							.revalidate(pathToRevalidate)
							.then(() => resolve({ path: pathToRevalidate }))
							.catch((error) =>
								reject({
									error: error?.toString(),
									path: pathToRevalidate,
								})
							)
					})
				)
			}
		})
	}

	// iterate over each nav node and revalidate its path
	navDataFiles.forEach(([basePath, navData]) => {
		revalidateNavNodes(basePath, navData)
	})

	// TODO(brkalow): Add resiliency here, this has the potential to send off hundreds of calls depending on the product, so we should think about how we want to handle network hiccups or partial failure.
	// wait for everything to get revalidated
	const validatedResults = await Promise.allSettled(revalidatePromises)

	let foundIndexs = {}
	const formattedResults = []
	validatedResults.forEach((result) => {
		let foundIndex
		const prevFoundIndex = foundIndexs[result.status]

		if (!prevFoundIndex || prevFoundIndex === -1) {
			foundIndex = formattedResults.findIndex((o) => o.status === result.status)
		} else {
			foundIndex = prevFoundIndex
		}

		if (foundIndex === -1) {
			foundIndex =
				formattedResults.push({
					status: result.status,
					paths: [],
				}) - 1 // push returns the new length, length - 1 is the index

			foundIndexs[result.status] = foundIndex
		}

		formattedResults[foundIndex].paths.push(
			result.status === 'fulfilled'
				? result.value.path
				: {
						path: result.reason.path,
						error: result.reason.error,
				  }
		)
	})

	response.status(200).json(formattedResults)
}

export default validateToken(handler, {
	token: process.env.REVALIDATE_TOKEN,
	onlyMethods: ['POST'],
})
