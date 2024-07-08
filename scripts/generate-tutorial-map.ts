/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getTutorialSlug } from '../src/views/collection-view/helpers'
import { getAllTutorials } from '../src/lib/learn-client/api/tutorial'

// We specifically want to generate the tutorial map from the production
// API, so we set the API URL explicitly since local development will typically
// be using the staging API.
process.env.NEXT_PUBLIC_LEARN_API_BASE_URL =
	'https://2mz7e9hai3.us-east-1.awsapprunner.com'

/**
 * This function creates a map of 'database-slug': 'dev-dot/path'
 */
async function generateTutorialMap(): Promise<Record<string, string>> {
	const allTutorials = await getAllTutorials({
		fullContent: false,
		slugsOnly: true,
	})

	const mapItems = allTutorials.map((t) => {
		const oldPath = t.slug
		const newPath = getTutorialSlug(t.slug, t.collection_slug)
		return [oldPath, newPath]
	})

	return Object.fromEntries(mapItems)
}

;(async () => {
	const tutorialMap = await generateTutorialMap()
	await writeFile(
		path.join('src', 'data', '_tutorial-map.generated.json'),
		JSON.stringify(tutorialMap, null, 2),
		'utf-8'
	)
})()
