/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'

// 1 hour
const MAP_MAX_AGE_IN_SECONDS = 60 * 60 * 60

/**
 * This API caches a tutorial-map blob for the tutorial rewrites
 * remark plugin - lib/remark-plugins/rewrite-tutorial-links.
 * This ensures that calls to `getAllTutorials` are limited
 * for ISR generated tutorial views
 */
export default async function tutorialsMapHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const mapData = await generateTutorialMap()
		if (Object.keys(mapData).length > 0) {
			res.setHeader('cache-control', `s-maxage=${MAP_MAX_AGE_IN_SECONDS}`)
			res.status(StatusCodes.OK).json(mapData)
		} else {
			res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Failed to generate tutorial map' })
		}
	} catch (e) {
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: 'Server error: unable to generate tutorial map' })
	}
}

/**
 * This function creates a map of 'database-slug': 'dev-dot/path'
 */
export async function generateTutorialMap(): Promise<Record<string, string>> {
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
