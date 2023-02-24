/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { ApiTutorial, ApiCollection } from '../api-types'
import { formatIdentifier } from '../utils'
import { identifier } from 'lib/learn-client/types'
import { get, toError } from '../../index'
import { TUTORIAL_API_ROUTE } from '.'

export interface ApiTutorialFullCollectionCtx
	extends Omit<ApiTutorial, 'featured_collections'> {
	featured_collections: ApiCollection[]
}

// Featured Collections are augmented to the base tutorial
export async function augmentTutorial(
	tutorial: ApiTutorial
): Promise<ApiTutorialFullCollectionCtx> {
	const featured_collections = await getFeaturedCollections(tutorial.id)
	const tutorialClone = Object.assign({}, tutorial)
	delete tutorialClone.featured_collections

	return {
		...tutorialClone,
		featured_collections,
	}
}

// featured collections are accessed via another route
async function getFeaturedCollections(
	idOrSlug: identifier
): Promise<ApiCollection[]> {
	const identifier = formatIdentifier(idOrSlug)

	// /tutorials/:id/collections
	const route = path.join(TUTORIAL_API_ROUTE, `${identifier}/collections`)
	const featuredCollectionsRes = await get(route)

	if (featuredCollectionsRes.ok) {
		const res = await featuredCollectionsRes.json()
		return res.result
	}

	const error = await toError(featuredCollectionsRes)
	throw error
}
