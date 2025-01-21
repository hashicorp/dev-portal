/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsContext } from 'next'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { Collection as ApiCollection } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import { buildCategorizedValidatedPatternsSidebar } from 'views/validated-patterns/utils/generate-sidebar-items'
import ValidatedPatternsCollectionView from 'views/validated-patterns/collection-view'
import { ValidatedPatternsCollectionViewProps } from 'views/validated-patterns/types'
import validatedPatternsContent from 'content/validated-patterns/index.json'
import validatedPatternsData from 'data/validated-patterns.json'

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ collectionSlug: string }>): Promise<
	{ props: ValidatedPatternsCollectionViewProps } | { notFound: boolean }
> {
	try {
		const allValidatedPatternsCollections = await getCollectionsBySection(
			validatedPatternsData.slug
		)

		if (!allValidatedPatternsCollections) {
			console.error('Collections not found:', params.collectionSlug)
			return { notFound: true }
		}

		const currentCollection = allValidatedPatternsCollections.find(
			(collection: ApiCollection) =>
				collection.slug ===
				`${validatedPatternsData.slug}/${params.collectionSlug}`
		)
		const sidebarSections = buildCategorizedValidatedPatternsSidebar(
			allValidatedPatternsCollections,
			validatedPatternsContent.sidebarCategories,
			currentCollection.slug
		)
		const breadcrumbLinks = [
			{ title: 'Developer', url: '/' },
			{
				title: validatedPatternsData.name,
				url: `/${validatedPatternsData.slug}`,
			},
			{
				title: currentCollection.name,
				url: `/${currentCollection.slug}`,
				isCurrentPage: true,
			},
		]

		return {
			props: stripUndefinedProperties({
				metadata: {
					title: currentCollection.name,
					validatedPatternsName: validatedPatternsData.name,
					validatedPatternsSlug: validatedPatternsData.slug,
				},
				collection: currentCollection,
				layoutProps: {
					sidebarSections,
					breadcrumbLinks,
				},
			}),
		}
	} catch (error) {
		console.error(error)
		return { notFound: true }
	}
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(
		validatedPatternsData.slug
	)
	const paths = allCollections.map((c: ApiCollection) => ({
		params: { collectionSlug: splitProductFromFilename(c.slug) },
	}))

	return {
		paths: paths.slice(0, __config.learn.max_static_paths ?? 0),
		fallback: 'blocking',
	}
}

export default ValidatedPatternsCollectionView
