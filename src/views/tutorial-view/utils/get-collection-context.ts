/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import moize, { Options } from 'moize'
import {
	Collection as ClientCollection,
	ProductOption,
	SectionOption,
	TutorialFullCollectionCtx as ClientTutorialFullCollectionCtx,
	TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { getCollection } from 'lib/learn-client/api/collection'
import { CollectionContext } from '..'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { splitProductFromFilename } from '.'

/**
 * We need to get the database slug for this tutorial, which may belong in a different
 * product directory in the filesystem. For example a tutorial with slug : `consul/get-started`
 * may be reference in a vault collection. So we can't assume this current
 * product context is valid for the db slug path
 */

interface CurrentCollectionTutorial {
	collection: {
		filename: string
		data: ClientCollection
	}
	tutorialReference: {
		filename: string
		dbSlug: string
	}
}

const moizeOpts: Options = {
	isPromise: true,
	maxSize: Infinity,
}
// Memoizing because tutorials in the same collection have identical return data
const cachedGetCollection = moize(getCollection, moizeOpts)

export async function getCurrentCollectionTutorial(
	sectionSlug: ProductOption | SectionOption,
	tutorialSlug: [string, string]
): Promise<CurrentCollectionTutorial> {
	/**
	 * In the db, slug structure for tutorials is {product}/{tutorial-filename}
	 * the tutorialSlug passed in is based on /{collection-name}/{tutorial-name}
	 * from the params. So we can assume `slug` index 1 is always the tutorial name
	 * */
	const [collectionFilename, tutorialFilename] = tutorialSlug
	const collectionDbSlug = `${sectionSlug}/${collectionFilename}`
	const collection = await cachedGetCollection(collectionDbSlug)
	/**
	 * This type is only `TutorialLite` which doesn't have the tutorial content
	 * so we only need the slug to make another request to get the full tutorial data in server.ts
	 */
	const currentTutorial = collection?.tutorials.find(
		(t: ClientTutorialLite) =>
			tutorialFilename === splitProductFromFilename(t.slug)
	)

	if (!currentTutorial) {
		console.error(
			`Tutorial filename: ${tutorialFilename} does not exist in collection: ${collectionDbSlug}`
		)
	}

	return {
		collection: {
			filename: collectionFilename,
			data: collection || null,
		},
		tutorialReference: {
			filename: tutorialFilename,
			dbSlug: currentTutorial?.slug || null,
		},
	}
}

// This function sets the default and filters the featured collections
export function getCollectionContext(
	currentCollection: ClientCollection,
	collectionCtx: ClientTutorialFullCollectionCtx['collectionCtx']
): CollectionContext {
	const featuredIn = collectionCtx.featuredIn.map(formatCollectionCard)

	return {
		default: {
			id: collectionCtx.default.id,
			slug: collectionCtx.default.slug,
		},
		current: currentCollection,
		featuredIn,
	}
}
