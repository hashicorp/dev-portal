import fetch from 'node-fetch'
import moize, { Options } from 'moize'
import { generateTutorialMap } from 'pages/api/tutorials-map'
import { withTiming } from 'lib/with-timing'

export async function getTutorialMap() {
	let result = {}

	// Set `baseUrl`, allowing VERCEL_URL to be a full URL or just a hostname
	const { VERCEL_URL } = process.env
	let baseUrl = 'http://localhost:3000'
	if (VERCEL_URL) {
		baseUrl = VERCEL_URL.startsWith('http')
			? VERCEL_URL
			: `https://${VERCEL_URL}`
	}

	const isDuringBuild = process.env.VERCEL && process.env.CI
	const apiRoute = new URL('api/tutorials-map', baseUrl)

	/**
	 * For statically generated pages, we can cache the tutorial
	 * map in memory. For ISR pages, we call an api route (/api/tutorials-map)
	 * where the map is cached. This ensures that the expensive map
	 * generation function is not called for every single tutorial
	 */
	try {
		if (isDuringBuild) {
			const tutorialMapRes = await cachedGenerateTutorialMap()
			result = tutorialMapRes
		} else {
			const tutorialMapRes = await withTiming(
				`[getTutorialMap] (${apiRoute})`,
				() => fetch(apiRoute)
			)
			if (tutorialMapRes.ok) {
				result = await tutorialMapRes.json()
			}
		}
	} catch (e) {
		console.error(e, 'Tutorials map could not be generated')
	}

	return result
}

// Caching the return value in memory for static builds to limit api calls
const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedGenerateTutorialMap = moize(generateTutorialMap, moizeOpts)
