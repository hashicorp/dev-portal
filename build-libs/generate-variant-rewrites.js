const createFetch = require('@vercel/fetch')
const fetch = createFetch()
const variantData = require('../src/content/variants.json')

const MAX_LIMIT = '100' // Defaults to API max

function get(path) {
	const options = {
		method: 'GET',
	}

	return fetch(`${process.env.NEXT_PUBLIC_LEARN_API_BASE_URL}${path}`, options)
}

async function toError(errorResponse) {
	let json
	try {
		json = await errorResponse.json()
	} catch (err) {
		// Do nothing if the response is not json
	}

	return new Error(
		`${errorResponse.status} ${errorResponse.statusText}${
			json?.error ? ` - ${json.error}` : ''
		}`
	)
}

async function fetchAll({ after, fetchedTutorials }) {
	// Set the base array if it's the first call
	if (typeof fetchedTutorials === 'undefined') {
		fetchedTutorials = []
	}

	const response = await fetchTutorials(after)

	if (response.ok) {
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
	const response = await get(route)

	if (response.ok) {
		return response
	}

	const error = await toError(response)
	throw error
}

async function getVariantRewrites() {
	// get all tutorial paths with variants
	const allTutorials = await fetchAll({})

	// filter out those that don't have variants
	const tutorialVariants = allTutorials.filter((tutorial) =>
		Boolean(tutorial.variant)
	)

	console.log(tutorialVariants.length, 'VARIANTS')

	// build each path with the correct cookie
	return tutorialVariants.flatMap((tutorial) => {
		const variant = variantData[tutorial.variant]
		console.log({ variant })
		const tutorialFilename = tutorial.slug.split('/')[1]

		return variant.map((variantOption) => ({
			source: `/:product/tutorials/:collection/${tutorialFilename}`,
			destination: `/:product/tutorials/:collection/${tutorialFilename}/${variantOption.id}`,
			has: [
				{ type: 'cookie', key: tutorial.variant, value: variantOption.id },
				// {
				// 	type: 'query',
				// 	key: 'variant',
				// 	value: variantOption.id,
				// },
			],
		}))
	})

	// use /:product/tutorials/:collection/tutorial?variants="slug:optionSlug"
	// with cookie
	// to /:product/tutorials/:collection/tutorial/{slug:optionSlug}
}

module.exports = { getVariantRewrites }
