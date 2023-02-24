/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
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

const BATCH_SIZE = 10
const DELAY_TIME = 500 // ms

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

		// Loop over all paths to revalidate in batches
		// as this endpoint will fire off >1000 revalidation requests
		let batchRevalidatePromises = []
		for (let i = 0; i < paths.length; i++) {
			// remove any trailing slash
			const path = paths[i].replace(/\/$/, '')
			console.log('[Revalidate]', path)
			batchRevalidatePromises.push(response.revalidate(path))

			// flush the batch every N paths, or at the end of the loop
			if (
				batchRevalidatePromises.length >= BATCH_SIZE ||
				i >= paths.length - 1
			) {
				await Promise.allSettled(batchRevalidatePromises)
				// delay to ensure we don't overwhelm the server
				// TODO consider using p-throttle instead https://github.com/sindresorhus/p-throttle
				await delay(DELAY_TIME)
				batchRevalidatePromises = []
			}
		}

		response.status(200).end()
	} catch (e) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		console.error('Error revalidating ', e)
		return response.status(500).send('Error revalidating')
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

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export default validateToken(handler, {
	token: process.env.REVALIDATE_TOKEN,
	onlyMethods: ['POST'],
})

/**
 * Testing Playground --------------------------------------
 * write as out file to test the output
 * with npx --package @hashicorp/platform-tools@0.5.0 hc-tools src/pages/api/revalidate-all-tutorials.ts
 *
 * 
  ;(async function main() {
	const tutorialLandingPaths = getTutorialLandingPaths()
	const collectionAndTutorialPaths = await getCollectionAndTutorialPaths()
	const paths = [
		...tutorialLandingPaths,
		'BREAK FOR COLLECTION AND TUTORIAL PATHS *****',
		...collectionAndTutorialPaths,
	]

	fs.writeFileSync('all-tutorial-paths.json', JSON.stringify(paths), {
		encoding: 'utf-8',
	})
})()
 * 
 *  TODO check on the cloud / theme handling
 */
