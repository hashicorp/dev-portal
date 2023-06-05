/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getPage, PageSlugOption } from 'lib/learn-client/api/page'
import gatherUniqueValues from 'lib/gather-unique-values'
import {
	getInlineCollections,
	getInlineTutorials,
	InlineCollections,
	InlineTutorials,
} from '../get-inline-content'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { ProductPage as ClientProductPage } from 'lib/learn-client/types'

/**
 * Given a product page slug,
 * fetch the `pageData` stored in our content API,
 * and package it with `inlineCollection` and `inlineTutorial` data
 * for any tutorials referenced in the `page_data`.
 */
export default async function getProductPageContent(
	pageSlug: PageSlugOption
): Promise<{
	pageData: ClientProductPage['pageData']
	inlineCollections: InlineCollections
	inlineTutorials: InlineTutorials
}> {
	// Fetch the base page content.
	const { pageData } = await getPage(pageSlug)
	// Page content blocks reference tutorials and collections by slug.
	// We need to fetch data for any referenced tutorials and collections.
	// 1. First, we build a list of all tutorial and collection slugs
	//    that have been referenced in the page content we fetched.
	const inlineTutorialSlugs = (
		await gatherUniqueValues(['tutorialSlug', 'tutorialSlugs'], pageData)
	).map(String)
	const inlineCollectionSlugs = (
		await gatherUniqueValues(['collectionSlug', 'collectionSlugs'], pageData)
	).map(String)
	// 2. Next we fetch the tutorial and collection data
	const inlineTutorials =
		inlineTutorialSlugs.length > 0
			? await getInlineTutorials(inlineTutorialSlugs)
			: undefined
	const inlineCollections =
		inlineCollectionSlugs.length > 0
			? await getInlineCollections(inlineCollectionSlugs)
			: undefined
	// Finally we return the fetched pageData, along with the inlineTutorials
	// and inlineCollections needed to render content blocks within it.
	return stripUndefinedProperties({
		pageData,
		inlineCollections,
		inlineTutorials,
	})
}
