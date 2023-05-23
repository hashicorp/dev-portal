const createFetch = require('@vercel/fetch')
const fetch = createFetch()

const MAX_LIMIT = '100' // Defaults to API max

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

// rewrite /:product/tutorials/:collection/tutorial?variants="slug:optionSlug"
// with proper cookie
// to /:product/tutorials/:collection/tutorial/{slug:optionSlug}
async function getVariantRewrites() {
	// get all tutorial paths with variants
	const allTutorials = await fetchAll({})

	// filter out those that don't have variants
	const tutorialVariants = allTutorials.filter((tutorial) =>
		Boolean(tutorial.variant)
	)

	// build each path with the correct cookie
	return tutorialVariants.flatMap((tutorial) => {
		const tutorialFilename = tutorial.slug.split('/')[1]

		return tutorial.variant.map((variantOption) => ({
			source: `/:product/tutorials/:collection/${tutorialFilename}`,
			destination: `/:product/tutorials/:collection/${tutorialFilename}/${variantOption.id}`,
			has: [
				{
					type: 'cookie',
					key: `variant-${tutorial.variant}`,
					value: variantOption.id,
				},
			],
		}))
	})
}

module.exports = { getVariantRewrites }
