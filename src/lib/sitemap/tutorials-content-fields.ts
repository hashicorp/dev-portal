/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getAllCollections } from 'lib/learn-client/api/collection'
import { SectionOption } from 'lib/learn-client/types'
import { activeProductSlugs } from 'lib/products'
import tutorialMap from 'data/_tutorial-map.generated.json'
import { ProductSlug } from 'types/products'
import { getCollectionSlug } from 'views/collection-view/helpers'
import { makeSitemapField } from './helpers'
import { Collection as ClientCollection } from 'lib/learn-client/types'

function getTutorialLandingPaths(): string[] {
	const activeSlugs = activeProductSlugs.map(
		(productSlug: ProductSlug) => `${productSlug}/tutorials`
	)
	const sectionOptionsWithLandingPage = Object.values(SectionOption).filter(
		(option: SectionOption) => option !== SectionOption.onboarding
	)
	const sectionOptions = sectionOptionsWithLandingPage.map(
		(slug: SectionOption) => `${slug}`
	)

	return [...activeSlugs, ...sectionOptions]
}

async function getCollectionPaths() {
	const allCollections = await getAllCollections()

	return allCollections.map((collection: ClientCollection) => {
		// build collection paths
		return getCollectionSlug(collection.slug)
	})
}

export async function allTutorialsFields() {
	const landingSlugs = getTutorialLandingPaths()
	const collectionSlugs = await getCollectionPaths()
	const tutorialSlugs = Object.values(tutorialMap)
	return [...landingSlugs, ...collectionSlugs, ...tutorialSlugs].map(
		(slug: string) => makeSitemapField({ slug })
	)
}
