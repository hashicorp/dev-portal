import { URL, URLSearchParams } from 'url'
import createFetch from '@vercel/fetch'
import pMap from 'p-map'
import proxyConfig from '../build-libs/proxy-config'
import { Collection, ProductOption, TutorialLite } from 'lib/learn-client/types'
import { getAllCollections } from 'lib/learn-client/api/collection'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import config from '../config/base.json'
import { productSlugs } from 'lib/products'

interface StaticPathsResponse {
	meta: {
		status_code: number
		status_text: string
	}
	result: {
		paths: {
			params: {
				page: string[]
			}
		}[]
	}
}

const DEV_PORTAL_URL = config.dev_dot.canonical_base_url

const fetch = createFetch()

/**
 * Returns a string representing a date that's `daysAgo` in the past, truncated
 * to midnight to improve cache hit rates.
 * Format: YYYY-MM-DD HH:MM:SS
 */
function getDateRange(daysAgo: number): string {
	const d = new Date()
	d.setTime(d.getTime() - 24 * 60 * 60 * 1000 * daysAgo)
	return `${d.toISOString().substring(0, 10)} 00:00:00`
}

/**
 * Uses the Marketing Content API to fetch the top 200 most viewed pages in the
 * past 28 days according to Fathom analytics.
 */
async function getUrlsToCache(product: string): Promise<string[]> {
	const url = new URL('https://content.hashicorp.com/api/static_paths')
	const params = {
		product,
		limit: '200',
		date_from: getDateRange(28),
		path_prefix: '/',
		param: 'page',
	}

	const formattedParams = new URLSearchParams(params)
	url.search = formattedParams.toString()

	const res = await fetch(url.toString())
	const data = (await res.json()) as StaticPathsResponse

	if (data.meta.status_code !== 200) {
		throw new Error(`Unexpected status: ${data.meta.status_code}`)
	}

	const baseUrl = proxyConfig[product].domain

	return data.result.paths.map((p) => {
		return [baseUrl, p.params.page.join('/')].join('/')
	})
}

// Fetch all tutorial paths per beta product
async function getTutorialUrlsToCache(
	product: ProductOption
): Promise<string[]> {
	const allProductCollections = await getAllCollections({
		product: { slug: product },
	})

	const filteredCollections = allProductCollections.filter(
		(c) => c.theme === product
	)
	// go through all collections, get the collection slug
	const paths = filteredCollections.flatMap((collection: Collection) => {
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
		const docsUrls = (
			await Promise.all(
				Object.keys(proxyConfig).map((product) => getUrlsToCache(product))
			)
		).flat(1)

		const tutorialUrls = (
			await Promise.all(
				productSlugs.map((product: ProductOption) =>
					getTutorialUrlsToCache(product)
				)
			)
		).flat(1)

		const urls = [...docsUrls, ...tutorialUrls]
		console.log(`number of urls to cache: ${urls.length}`)
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
		process.exit()
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
})()
