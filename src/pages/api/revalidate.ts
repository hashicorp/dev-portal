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
 * refactor out docs product specific logic into own function
 *
 */

async function handleProductDocsRevalidation(product: string) {
	// Handle TF's sub-projects
	// @TODO fix up type check here
	let resolvedProduct = product
	if (
		resolvedProduct.startsWith('terraform-') ||
		resolvedProduct === 'ptfe-releases'
	) {
		resolvedProduct = 'terraform'
	}

	const productData = cachedGetProductData(resolvedProduct as ProductSlug)

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

	const pathsToRevalidate = []

	// iterates through nav data recursively and creates a revalidate request
	function constructRevalidateNavNodes(basePath, nodes) {
		nodes.forEach(({ path, routes }) => {
			if (routes) {
				constructRevalidateNavNodes(basePath, routes)
				return
			}

			if (typeof path !== 'undefined') {
				const pathToRevalidate = `/${product}/${basePath}/${path}`
					// remove any trailing slash
					.replace(/\/$/, '')

				pathsToRevalidate.push(pathToRevalidate)
			}
		})
	}

	// iterate over each nav node and revalidate its path
	navDataFiles.forEach(([basePath, navData]) => {
		constructRevalidateNavNodes(basePath, navData)
	})

	return pathsToRevalidate
}

/**
 * Accepts a POST request with a product slug, triggers revalidation for all of a product's docs paths
 * specified in its latest nav data.
 */
async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method !== 'POST') {
		response.status(StatusCodes.NOT_FOUND)
		return
	}

	const { product, paths } = request.body
	const pathsExist = paths || paths.length > 0

	if (!product && !pathsExist) {
		response
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: '[Revalidation failed]: No product or paths provided.' })

		return
	}

	const pathsToRevalidate = []

	if (product) {
		const docsPaths = await handleProductDocsRevalidation(product)
		pathsToRevalidate.push(...docsPaths)
	}

	if (pathsExist) {
		//handle path revalidation
	}

	const revalidatePromises = []

	pathsToRevalidate.forEach((path: string) => {
		console.log('[revalidate]', path)
		revalidatePromises.push(response.revalidate(path))
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
