/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ApiCollection, ApiCollectionLite, ApiTutorial } from '../api-types'
import {
	Tutorial,
	CollectionLite,
	TutorialVideo,
	TutorialHandsOnLab,
	TutorialFullCollectionCtx,
	CollectionCtxLite,
	CollectionCtxFull,
} from 'lib/learn-client/types'
import { formatCollection, formatProductUsed } from '../collection/formatting'
import { ApiTutorialFullCollectionCtx } from './augment-tutorial'

/**
 * This function handles two types of return tutorial data from the API.
 * For getTutorials and getAllTutorials, the API returns CollectionLite
 * for featured_collections. But with getTutorial, we need featured_collections
 * to be the full Collection type (with tutorials).
 *
 * This function returns either:
 * - Tutorial, with featuredCollections: CollectionLite
 * - or TutorialFullCollectionCtx, with featuredCollections: Collection
 */
export function formatTutorialData(
	tutorial: ApiTutorial | ApiTutorialFullCollectionCtx
): Tutorial | TutorialFullCollectionCtx {
	const {
		id,
		slug,
		name,
		description,
		content,
		default_collection_id,
		featured_collections,
		read_time,
		edition,
		products_used,
		variant,
	} = tutorial
	const productsUsed = products_used.map(formatProductUsed)
	const video = formatVideo(tutorial)
	const handsOnLab = formatHandsOnLab(tutorial)
	const collectionCtx = formatCollectionCtx(
		featured_collections,
		default_collection_id
	)

	return {
		id,
		slug,
		name,
		description,
		content,
		collectionCtx,
		productsUsed,
		readTime: read_time,
		video,
		handsOnLab,
		edition: edition,
		variant,
	}
}

export function formatToCollectionLite(
	collection: ApiCollectionLite
): CollectionLite {
	const { id, name, slug, short_name, level, theme } = collection
	return { id, name, slug, shortName: short_name, level, theme }
}

function formatCollectionCtx(
	featuredCollections: ApiCollection[] | ApiCollectionLite[],
	defaultCollectionId
): CollectionCtxLite | CollectionCtxFull {
	let featuredIn
	const defaultCollection = featuredCollections.find(
		({ id }) => id === defaultCollectionId
	)

	// assuming if the first collection has tutorials, were dealing with full Collection
	if ('tutorials' in featuredCollections[0]) {
		featuredIn = featuredCollections.map(formatCollection)
	} else {
		featuredIn = featuredCollections.map(formatToCollectionLite)
	}

	const collectionCtx = {
		default: formatToCollectionLite(defaultCollection),
		featuredIn,
	}

	return collectionCtx
}

export function formatVideo({
	video_id,
	video_host,
	video_inline,
}: ApiTutorial | ApiTutorialFullCollectionCtx): TutorialVideo | undefined {
	let video = undefined

	if (video_id) {
		video = {
			id: video_id,
			videoHost: video_host,
			videoInline: video_inline,
		}
	}

	return video
}

export function formatHandsOnLab({
	hands_on_lab_id,
	hands_on_lab_provider,
}: ApiTutorial | ApiTutorialFullCollectionCtx): TutorialHandsOnLab | undefined {
	let handsOnLab = undefined

	if (hands_on_lab_id) {
		handsOnLab = {
			id: hands_on_lab_id,
			provider: hands_on_lab_provider,
		}
	}

	return handsOnLab
}
