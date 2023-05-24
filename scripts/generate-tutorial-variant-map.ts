import createFetch from '@vercel/fetch'
import path from 'path'
import fs from 'fs'
const fetch = createFetch()

const MAX_LIMIT = '100' // Defaults to API max

async function fetchAll({ after, fetchedTutorials }) {
	// Set the base array if it's the first call
	if (typeof fetchedTutorials === 'undefined') {
		fetchedTutorials = []
	}

	const response = await fetchTutorials(after)

	if ('ok' in response && response.ok) {
		const data = await response.json()
		const allTutorials = [...fetchedTutorials, ...data.result]

		/*
		 ** If recurse is false, we only want the # of tuts specific by the limit.
		 ** If there's less than 100 tutorials fetched (less than the max limit),
		 ** that means that we've fetched everything.
		 */
		if (data.result.length < Number(MAX_LIMIT)) {
			return allTutorials
		}

		// Otherwise, recurse to get the next batch of tutorials
		return fetchAll({
			// The last ID
			after: data.result[data.result.length - 1].id,
			// Pass the accumulated tutorials
			fetchedTutorials: allTutorials,
		})
	}
}

async function fetchTutorials(after) {
	const limit = MAX_LIMIT
	const params = new URLSearchParams({ limit })

	if (after) {
		params.append('after', after)
	}

	const queryStr = `?${params.toString()}`
	const route = '/tutorials' + queryStr
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_LEARN_API_BASE_URL}${route}`,
		{
			method: 'GET',
		}
	)

	if (response.ok) {
		return response
	} else {
		return new Error(`${response.status} ${response.statusText}`)
	}
}

/**
 * Fetch all the tutorials with variants defined and build up a map
 * of every possible collection tutorial path and the associated variant
 * slug and variant options. Example output:
 *
 * "/consul/tutorials/kubernetes/kubernetes-api-gateway": {
 *  "slug": "consul-deploy",
 *  "options": [
 *    "hcp",
 *    "self-managed"
 *  ],
 *  "defaultOption": "hcp",
 * },
 */
async function getVariantRewrites() {
	// get all tutorial paths with variants
	const allTutorials = await fetchAll({
		after: undefined,
		fetchedTutorials: undefined,
	})

	// filter out those that don't have variants
	const tutorialVariants = allTutorials.filter(
		(tutorial) => tutorial.variants?.length > 0
	)
	const variantsObj = {}

	// for each tutorial that has variants defined
	tutorialVariants.map((tutorial) => {
		const tutorialFilename = tutorial.slug.split('/')[1]
		const variant = tutorial.variants[0] // we only support 1 variant right now

		// map over the collection paths to build up each tutorial path with the variant options
		tutorial.featured_collections.map((collection) => {
			const [product, collectionFilename] = collection.slug.split('/')
			const path = `/${product}/tutorials/${collectionFilename}/${tutorialFilename}`

			variantsObj[path] = {
				slug: variant.slug,
				options: variant.options.map(({ slug }) => slug),
				defaultOption: variant.options.find(
					(option) => option.display_order === 1
				),
			}
		})
	})

	return variantsObj
}

// @TODO if this file gets too large, consider storing it in vercel edge config
// https://vercel.com/docs/storage/edge-config
;(async function writeVariantRewriteMap() {
	const variantRewrites = await getVariantRewrites()

	await fs.promises.writeFile(
		path.join('src', '.generated', 'tutorial-variant-map.json'),
		JSON.stringify(variantRewrites, null, 2),
		'utf-8'
	)
})()
