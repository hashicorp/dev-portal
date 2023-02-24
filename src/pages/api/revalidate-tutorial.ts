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
import { getCollectionSlug } from 'views/collection-view/helpers'

/**
 * Accepts a POST request with a tutorial object, triggers revalidation for all paths associated with that tutorial
 * along with the parent collection pages and product tutorial landing paths for the products used.
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
			.json({ error: '[Revalidation failed]: No tutorial object provided.' })

		return
	}

	try {
		const revalidatePromises = []
		const paths = getPathsToRevalidate(tutorial)

		if (!paths || paths.length === 0) {
			response.status(200).end()
		}

		paths.forEach((path: string) => {
			console.log('[Revalidate]', path)
			revalidatePromises.push(response.revalidate(path))
		})

		// TODO: Add resiliency here, with concurrency or batching
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

/**
 * TODO consider busting the cache for all other tutorials in the collections as well
 * this would only matter in the case of a name change for the sidebar data
 * This would require an additional API call as we don't have the tutorial
 * array within the featured collection objects with this return data at the moment.
 **/
function getPathsToRevalidate(tutorial: ApiTutorialLite): string[] {
	const paths = []

	tutorial.featured_collections.map((collection: ApiFeaturedCollection) => {
		// add individual tutorial path per collection
		paths.push(getTutorialSlug(tutorial.slug, collection.slug))

		// add each collection path
		paths.push(getCollectionSlug(collection.slug))
	})

	// add product tutorial landing paths for each product used
	tutorial.products_used.map((product: ApiProductsUsed) =>
		paths.push(`/${product.product.slug}/tutorials`)
	)

	return paths
}
