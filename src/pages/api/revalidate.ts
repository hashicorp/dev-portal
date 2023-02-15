/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { NextApiRequest, NextApiResponse } from 'next/types'
import { StatusCodes } from 'http-status-codes'
import { validateToken } from 'lib/api-validate-token'
import { cachedGetProductData } from 'lib/get-product-data'
import { ProductSlug, RootDocsPath } from 'types/products'

/**
 * refactor out docs product specific logic into own function
 *
 *
 * a cool api would be to accept a list of paths
 * - this could get quite large and may exceed the body size limits
 * for http request?
 *
 * Another option is to revalidate all paths for the product, like docs
 * that means redirects wont work unless we fully redeploy dev portal
 * but they can just manually run that action? or we could detect it and run
 * when that files changes
 *
 * how do we get the list of paths?
 * 	- returning them from the content sync would be absolutely dope
 * 	- quick and dirty might be reading from git diff in an action? sounds messy
 *  - then we can construct the paths
 *
 * we could also batch calls to revalidate if we have more that (100 paths?) not sure the right number there
 */

type NavDataPrefix = Pick<
	RootDocsPath,
	'navDataPrefix' | 'path' | 'productSlugForLoader'
>

async function handleProductDocsRevalidation(product: string) {
	// Handle TF's sub-projects
	let resolvedProduct = product
	if (
		resolvedProduct.startsWith('terraform-') ||
		resolvedProduct === 'ptfe-releases'
	) {
		resolvedProduct = 'terraform'
	}

	// @TODO fix up type cast here
	const productData = cachedGetProductData(resolvedProduct as ProductSlug)

	const navDataPrefixes = productData.rootDocsPaths.map(
		({
			navDataPrefix,
			path,
			productSlugForLoader,
		}: RootDocsPath): NavDataPrefix => {
			return { navDataPrefix, path, productSlugForLoader }
		}
	)

	// fetch the latest nav data, which will be used to construct paths to revalidate
	const navDataFiles = (
		await Promise.all(
			navDataPrefixes.map(
				async ({
					navDataPrefix,
					path,
					productSlugForLoader,
				}: NavDataPrefix) => {
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

	// @TODO should we consider a limit on the number of paths?
	const { product, paths } = request.body
	const pathsExist = paths || paths.length > 0

	if (!product && !pathsExist) {
		response
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: '[Revalidation failed]: No product or paths provided.' })

		return
	}

	try {
		const pathsToRevalidate = pathsExist ? paths : []

		if (product) {
			const docsPaths = await handleProductDocsRevalidation(product)
			pathsToRevalidate.push(...docsPaths)
		}

		const revalidatePromises = []

		pathsToRevalidate.forEach((path: string) => {
			// remove any trailing slash
			const formattedPath = path.replace(/\/$/, '')
			console.log('[revalidate]', formattedPath)
			revalidatePromises.push(response.revalidate(formattedPath))
		})

		// TODO(brkalow): Add resiliency here, this has the potential to send off hundreds of calls depending on the product, so we should think about how we want to handle network hiccups or partial failure.
		// wait for everything to get revalidated
		await Promise.allSettled(revalidatePromises)

		response.status(200).end()
	} catch (e) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		console.error('Error revalidating ', e)
		return response.status(500).send('Error revalidating')
	}
}

export default validateToken(handler, {
	token: process.env.REVALIDATE_TOKEN,
	onlyMethods: ['POST'],
})
