/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { NextApiRequest, NextApiResponse } from 'next/types'
import { StatusCodes } from 'http-status-codes'

import { validateToken } from 'lib/api-validate-token'
import { getAllCollections } from 'lib/learn-client/api/collection'
import {
	Collection as ClientCollection,
	TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { activeProductSlugs } from 'lib/products'
import { SectionOption } from 'lib/learn-client/types'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { getCollectionSlug } from 'views/collection-view/helpers'
import { ProductSlug } from 'types/products'

const BATCH_SIZE = 5

/**
 * Accepts a POST request, triggers revalidation for all tutorial paths for all products
 * landing pages, collection pages, and tutorial pages associated
 */
async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method !== 'POST') {
		response.status(StatusCodes.NOT_FOUND)
		return
	}

	try {
		const tutorialLandingPaths = getTutorialLandingPaths()
		const collectionAndTutorialPaths = await getCollectionAndTutorialPaths()
		const paths: string[] = [
			...tutorialLandingPaths,
			...collectionAndTutorialPaths,
		]

		if (!paths || paths.length === 0) {
			response.status(200).end()
		}

		// Sending 'accepted' status to avoid socket hang-up as the path revaliadation takes a very long time
		response
			.status(StatusCodes.ACCEPTED)
			.send(`Revalidating all tutorials: ${paths.length} paths`)

		// Loop over all paths to revalidate in batches
		// as this endpoint will fire off >1000 revalidation requests
		let batchRevalidatePromises = []
		for (let i = 0; i < paths.length; i++) {
			// remove any trailing slash
			const path = paths[i].replace(/\/$/, '')
			console.log('[revalidate]', path)
			batchRevalidatePromises.push(response.revalidate(path))

			// flush the batch every N paths, or at the end of the loop
			if (
				batchRevalidatePromises.length >= BATCH_SIZE ||
				i >= paths.length - 1
			) {
				// TODO potentially limit these calls to an interval - see p-queue
				await Promise.allSettled(batchRevalidatePromises)
				batchRevalidatePromises = []
			}
		}
	} catch (e) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		console.error('Error revalidating tutorials ', e)
		return response
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`Error revalidating tutorials ${e.message}`)
	}
}

function getTutorialLandingPaths(): string[] {
	const paths = []

	// build all product tutorial landing paths
	activeProductSlugs.forEach((productSlug: ProductSlug) => {
		paths.push(`/${productSlug}/tutorials`)
	})

	// for waf and onboarding routes that are top level
	Object.values(SectionOption).forEach((slug: SectionOption) => {
		paths.push(`/${slug}`)
	})

	return paths
}

async function getCollectionAndTutorialPaths() {
	const collectionPaths = []
	const tutorialPaths = []
	const allCollections = await getAllCollections()

	allCollections.forEach((collection: ClientCollection) => {
		// build collection paths
		collectionPaths.push(getCollectionSlug(collection.slug))

		// build tutorial paths
		collection.tutorials.forEach((tutorial: ClientTutorialLite) => {
			tutorialPaths.push(getTutorialSlug(tutorial.slug, collection.slug))
		})
	})

	return [...collectionPaths, ...tutorialPaths]
}

export default validateToken(handler, {
	token: process.env.REVALIDATE_TOKEN,
	onlyMethods: ['POST'],
})
