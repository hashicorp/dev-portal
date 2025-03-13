/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getAllCollections } from 'lib/learn-client/api/collection'
import { productSlugs } from 'lib/products'
import tutorialMap from 'data/_tutorial-map.generated.json'
import { ProductSlug } from 'types/products'
import { getCollectionSlug } from 'views/collection-view/helpers'
import { makeSitemapField } from './helpers'
import { Collection as ClientCollection } from 'lib/learn-client/types'

function getTutorialLandingPaths(): string[] {
	return productSlugs.map(
		(productSlug: ProductSlug) => `${productSlug}/tutorials`
	)
}

async function getCollectionPaths() {
	const allCollections = await getAllCollections()

	return allCollections.map((collection: ClientCollection) => {
		// build collection paths
		return getCollectionSlug(collection.slug)
	})
}

export async function allTutorialsFields(config: typeof __config) {
	const landingSlugs = getTutorialLandingPaths()
	const collectionSlugs = await getCollectionPaths()
	const tutorialSlugs = Object.values(tutorialMap)
	return [...landingSlugs, ...collectionSlugs, ...tutorialSlugs].map(
		(slug: string) => makeSitemapField({ slug }, config)
	)
}
