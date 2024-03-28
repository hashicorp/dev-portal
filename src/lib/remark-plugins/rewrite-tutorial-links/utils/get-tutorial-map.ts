/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import moize, { Options } from 'moize'
import { generateTutorialMap } from 'pages/api/tutorials-map'

export async function getTutorialMap() {
	let result = {}
	const isDuringBuild = process.env.VERCEL && process.env.CI
	const baseUrl = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: 'http://localhost:3000'
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
			const tutorialMapRes = await fetch(apiRoute)
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
