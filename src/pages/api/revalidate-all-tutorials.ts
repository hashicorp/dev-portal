/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import moize, { Options } from 'moize'
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

/**
 * Accepts a POST request with a tutorial object, triggers revalidation for all paths associated with that tutorial
 * along with the parent collection pages and product tutorial landing paths for the products used.
 */
async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method !== 'POST') {
		response.status(StatusCodes.NOT_FOUND)
		return
	}

	try {
		const revalidatePromises = []
		const tutorialLandingPaths = getTutorialLandingPaths()
		const collectionAndTutorialPaths = await getCollectionAndTutorialPaths()
		const paths = [...tutorialLandingPaths, ...collectionAndTutorialPaths]

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

const moizeOpts: Options = {
	isPromise: true,
	maxSize: Infinity,
	isDeepEqual: true,
}

// limit the expensive call for collections who all have the same product
// TODO check how this functions, will this cache properly on the edge?
// cache the collection paths in the res header?
const cachedGetAllCollections = moize(getAllCollections, moizeOpts)

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
	const paths = []

	const allCollections = await cachedGetAllCollections()

	allCollections.forEach((collection: ClientCollection) => {
		// build collection path
		paths.push(getCollectionSlug(collection.slug))

		// build tutorial path
		collection.tutorials.forEach((tutorial: ClientTutorialLite) => {
			paths.push(getTutorialSlug(tutorial.slug, collection.slug))
		})
	})

	return paths
}

/**
 * write as out file to test the output
 *
 *  TODO check on the cloud / theme handling
 */
