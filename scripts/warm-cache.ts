/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { URL } from 'url'
import createFetch from '@vercel/fetch'
import pMap from 'p-map'
import { Collection, ProductOption, TutorialLite } from 'lib/learn-client/types'
import {
	getAllCollections,
	getCollectionsBySection,
} from 'lib/learn-client/api/collection'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import config from '../config/base.json'
import { activeProductSlugs } from 'lib/products'
import { ProductSlug } from 'types/products'

const DEV_PORTAL_URL = config.dev_dot.canonical_base_url

// the socket timeout here matches Vercel's serverless function execution timeout (900s) as defined here: https://vercel.com/docs/concepts/limits/overview#general-limits
const fetch = createFetch(null, { timeout: 900 * 1000 })

/**
 * Uses the /api/revalidate endpoint to statically generate all docs pages for each product
 */
async function warmDeveloperDocsCache() {
	const url = new URL('/api/revalidate', DEV_PORTAL_URL)

	for (const productSlug of activeProductSlugs) {
		const body = JSON.stringify({ product: productSlug })

		try {
			console.log(`triggering revalidate for ${productSlug}...`)
			const startTime = Date.now()

			await fetch(url.toString(), {
				method: 'POST',
				body,
				headers: {
					'content-type': 'application/json',
					authorization: `Bearer ${process.env.REVALIDATE_TOKEN}`,
				},
			})

			const elapsedTime = Date.now() - startTime
			console.log(
				`successfully warmed the cache for ${productSlug}'s docs routes (${elapsedTime}ms)`
			)
		} catch (error) {
			console.log(
				'failed to trigger revalidate for product:',
				productSlug,
				error
			)
		}
	}
}

// Fetch all tutorial paths per beta product
async function getTutorialUrlsToCache(product: ProductSlug): Promise<string[]> {
	let allProductCollections

	if (product === 'hcp') {
		allProductCollections = await getCollectionsBySection('cloud')
	} else {
		const collections = await getAllCollections({
			product: { slug: product as ProductOption },
		})

		allProductCollections = collections.filter((c) => c.theme === product)
	}

	// go through all collections, get the collection slug
	const paths = allProductCollections.flatMap((collection: Collection) => {
		const collectionSlug = splitProductFromFilename(collection.slug)
		// go through the tutorials within this collection, create a path for each
		return collection.tutorials.map((tutorial: TutorialLite) => {
			const tutorialSlug = splitProductFromFilename(tutorial.slug)
			const url = new URL(
				`${product}/tutorials/${collectionSlug}/${tutorialSlug}`,
				DEV_PORTAL_URL
			)
			return url.toString()
		})
	})

	// Tutorial path format: /{product}/tutorials/{collection}/{tutorial}
	return paths
}

;(async () => {
	try {
		const tutorialUrls = (
			await Promise.all(
				activeProductSlugs.map((product: ProductSlug) =>
					getTutorialUrlsToCache(product)
				)
			)
		).flat(1)

		console.log('Triggering revalidate for documentation pages')
		const developerDocsCachePromise = warmDeveloperDocsCache()

		const urls = [...tutorialUrls]
		console.log(`number of urls to cache: ${urls.length}`)

		try {
			await pMap(
				urls,
				async (url) => {
					const res = await fetch(url)
					// If a popular page is returning a 404, that's _probably_ okay, so it
					// doesn't warrant a failing CI run, but it does warrant being logged.
					if (res.status === 404) {
						console.log(`unexpected 404 for ${url}`)
					} else if (res.status !== 200) {
						throw new Error(`unexpected ${res.status} for ${url}`)
					} else {
						console.log(`cached ${url}`)
					}
				},
				{ concurrency: 16, stopOnError: false }
			)
		} catch (err) {
			console.error('Error warming specific URLs:', err)
		}

		await developerDocsCachePromise

		process.exit()
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
})()
