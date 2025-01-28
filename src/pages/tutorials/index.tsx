/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import pageData from 'content/tutorials-landing.json'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { Collection } from 'lib/learn-client/types'
import { getCollections } from 'lib/learn-client/api/collection'
import TutorialsLandingView from 'views/tutorials-landing'
import { LearnProductSlug } from 'types/products'
import { PAGE_SUBTITLE } from 'views/tutorials-landing/constants'

/**
 * @TODO
 * - clean up types to be shared across files
 * - add validation on the JSON file
 */
interface PageContent {
	crossProductSection: {
		collectionSlugs: string[]
	}
	productSections: Record<
		LearnProductSlug,
		{
			certificationProgram: {
				slug: string
				title: string
				description: string
			}
			featuredUseCases: { href: string; text: string }[]
			featuredCollectionSlugs: string[]
		}
	>
}

const getStaticProps = async () => {
	const { crossProductSection, productSections } = pageData as PageContent
	const crossProductSectionCollectionSlugs = crossProductSection.collectionSlugs

	const collectionSlugsToFetch = new Set<string>([
		...crossProductSectionCollectionSlugs,
	])

	Object.values(productSections).forEach(({ featuredCollectionSlugs }) => {
		featuredCollectionSlugs?.forEach((collectionSlug) => {
			collectionSlugsToFetch.add(collectionSlug)
		})
	})

	// Fetch the collections
	const collections = await getCollections(Array.from(collectionSlugsToFetch))

	// Package up fetched data for the view
	const pageContent = {}
	Object.entries(productSections).forEach(([productSlug, productContent]) => {
		const certification = productContent.certificationProgram
		const featuredUseCases = productContent.featuredUseCases
		const featuredCollections = productContent.featuredCollectionSlugs
			? productContent.featuredCollectionSlugs.map((collectionSlug) => {
					const collection = collections.find(
						(collection) => collection.slug === collectionSlug
					)
					return collection
			  })
			: null

		pageContent[productSlug] = {
			certification,
			featuredCollections,
			featuredUseCases,
		}
	})
	const crossProductSectionCollections = crossProductSectionCollectionSlugs.map(
		(collectionSlug: Collection['slug']) =>
			collections.find(
				(collection: Collection) => collection.slug === collectionSlug
			)
	)

	return {
		props: stripUndefinedProperties({
			metadata: {
				title: 'Tutorials',
				description: PAGE_SUBTITLE,
				localOgImage: 'tutorials.jpg',
			},
			pageContent: {
				...pageContent,
				crossProductSectionCollections,
			},
		}),
	}
}

export { getStaticProps }
export default TutorialsLandingView
