/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Collection, ProductUsed, TutorialLite } from 'lib/learn-client/types'
import {
	ApiCollection,
	ApiTutorialLite,
	ApiCollectionTutorial,
	ApiProductsUsed,
} from '../api-types'
import {
	formatHandsOnLab,
	formatToCollectionLite,
	formatVariant,
	formatVideo,
} from '../tutorial/formatting'

export function formatCollection(collection: ApiCollection): Collection {
	const {
		id,
		slug,
		name,
		short_name,
		description,
		icon,
		theme,
		ordered,
		level,
		category,
		tutorials,
	} = collection

	return {
		id,
		slug,
		name,
		shortName: short_name,
		description,
		icon,
		theme,
		ordered,
		level,
		category: category || undefined,
		tutorials: tutorials.map(formatToTutorialLite),
	}
}

export function formatToTutorialLite(
	item: ApiCollectionTutorial
): TutorialLite {
	const {
		id,
		name,
		short_name,
		slug,
		description,
		read_time,
		edition,
		products_used,
		default_collection,
	}: ApiTutorialLite = item.tutorial
	const productsUsed = products_used.map(formatProductUsed)
	const video = formatVideo(item.tutorial)
	const handsOnLab = formatHandsOnLab(item.tutorial)
	const formattedVariant =
		item.tutorial.variants?.length > 0
			? formatVariant(item.tutorial.variants[0])
			: undefined

	return {
		id,
		name,
		shortName: short_name || name,
		slug,
		description,
		readTime: read_time,
		edition: edition,
		productsUsed,
		video,
		handsOnLab,
		defaultContext: formatToCollectionLite(default_collection),
		variant: formattedVariant,
	}
}

export function formatProductUsed(productUsed: ApiProductsUsed): ProductUsed {
	const {
		product,
		tutorial_id,
		is_primary,
		is_beta,
		min_version,
		max_version,
	} = productUsed
	const { id, slug, name, docs_url, description } = product
	return {
		product: {
			id,
			slug,
			name,
			docsUrl: docs_url,
			description,
		},
		tutorial: tutorial_id,
		isPrimary: is_primary,
		isBeta: is_beta,
		minVersion: min_version || undefined,
		maxVersion: max_version || undefined,
	}
}
