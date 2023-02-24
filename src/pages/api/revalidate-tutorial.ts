/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { NextApiRequest, NextApiResponse } from 'next/types'
import { StatusCodes } from 'http-status-codes'
import { validateToken } from 'lib/api-validate-token'
import {
	ApiFeaturedCollection,
	ApiProductsUsed,
	ApiTutorialLite,
} from 'lib/learn-client/api/api-types'
import { getTutorialSlug } from 'views/collection-view/helpers'

/***
 *
 * WIP = This route accepts a single tutorial and will update all paths associated with that tutorial
 * along with the collections and product tutorial landing paths for the products used.
 */

/**
 * Accepts a POST request with a tutorial slug, triggers revalidation for all tutorials
 * in the collections the tutorial is featured in, along with the collection path.
 */
async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method !== 'POST') {
		response.status(StatusCodes.NOT_FOUND)
		return
	}

	const { tutorial }: { tutorial: ApiTutorialLite } = request.body

	if (!tutorial) {
		response
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: '[Revalidation failed]: No tutorial provided.' })

		return
	}

	try {
		const revalidatePromises = []
		const paths = []

		tutorial.featured_collections.map((collection: ApiFeaturedCollection) => {
			// build up individual tutorial path per collection
			paths.push(getTutorialSlug(tutorial.slug, collection.slug))

			// add each collection path
			const [productSlug, collectionFilename] = collection.slug.split('/')
			paths.push(`/${productSlug}/tutorials/${collectionFilename}`)
		})

		// build up product paths for each product used
		tutorial.products_used.map((product: ApiProductsUsed) =>
			paths.push(`/${product.product.slug}/tutorials`)
		)

		paths.forEach((path: string) => {
			// remove any trailing slash
			const formattedPath = path.replace(/\/$/, '')
			// TODO logic here of what to revalidate
			// start with just the tutorial path and the collection from the tutorial map
			console.log('[revalidate]', formattedPath)
			revalidatePromises.push(response.revalidate(formattedPath))
		})

		console.log(tutorial.slug, paths)

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
