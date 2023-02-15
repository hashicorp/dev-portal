/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getInlineContentMaps } from 'lib/tutorials/get-inline-content-maps'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { HomePageContentProps } from '../types'
import { HomePageAuthoredContent } from '../content-schema'

/**
 * Given authored content for the home page,
 * Return a prepared props object to be passed to the home page view
 */
async function transformRawContent(
	authoredContent: HomePageAuthoredContent
): Promise<HomePageContentProps> {
	// Destructure data needed from given `authoredContent`
	const { hero, navNotice, merchandising, certificationsSection, preFooter } =
		authoredContent

	// For the certificationsSection, transform collectionSlugs to card data
	const { collectionSlugs, ...restCertificationsSection } =
		certificationsSection
	const { inlineCollections } = await getInlineContentMaps(
		certificationsSection
	)
	const collectionCards = collectionSlugs.map((slug: string) => {
		const collectionData = inlineCollections[slug]
		return formatCollectionCard(collectionData)
	})

	// Return props for the view
	return {
		hero,
		navNotice: navNotice || null, // Note: may be undefined, need null instead
		merchandising,
		certificationsSection: {
			collectionCards,
			...restCertificationsSection,
		},
		preFooter,
	}
}

export { transformRawContent }
