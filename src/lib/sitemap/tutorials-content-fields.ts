/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { getAllCollections } from 'lib/learn-client/api/collection'
import { productSlugs } from 'lib/products'
import tutorialMap from 'data/_tutorial-map.generated.json'
import { ProductSlug } from 'types/products'
import { getCollectionSlug } from 'views/collection-view/helpers'
import { makeSitemapField } from './helpers'
import { Collection as ClientCollection } from 'lib/learn-client/types'

function getTutorialLandingPaths(): { path: string; last_modified: string }[] {
	return productSlugs.map((productSlug: ProductSlug) => {
		return {
			path: `${productSlug}/tutorials`,
			last_modified: new Date().toISOString(),
		}
	})
}

async function getCollectionPaths() {
	const allCollections = await getAllCollections()

	return allCollections.map((collection: ClientCollection) => {
		// build collection paths
		return {
			path: getCollectionSlug(collection.slug),
			last_modified: collection.updated_at,
		}
	})
}

export async function allTutorialsFields(config: typeof __config) {
	const landingSlugs = getTutorialLandingPaths()
	const collectionSlugs = await getCollectionPaths()
	const tutorialSlugs = Object.values(tutorialMap)
	return [...landingSlugs, ...collectionSlugs, ...tutorialSlugs].map(
		(obj: { path: string, last_modified: string }) => {
			return makeSitemapField(
				{ slug: obj.path, lastmodDate: obj.last_modified },
				config
			)
		}
	)
}
