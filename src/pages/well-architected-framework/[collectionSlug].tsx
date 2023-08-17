/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsContext } from 'next'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { Collection as ApiCollection } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import { buildCategorizedWafSidebar } from 'views/well-architected-framework/utils/generate-sidebar-items'
import WellArchitectedFrameworkCollectionView from 'views/well-architected-framework/collection-view'
import { WellArchitectedFrameworkCollectionViewProps } from 'views/well-architected-framework/types'
import wafContent from 'content/well-architected-framework/index.json'
import wafData from 'data/well-architected-framework.json'

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ collectionSlug: string }>): Promise<{
	props: WellArchitectedFrameworkCollectionViewProps
}> {
	const allWafCollections = await getCollectionsBySection(wafData.slug)
	const currentCollection = allWafCollections.find(
		(collection: ApiCollection) =>
			collection.slug === `${wafData.slug}/${params.collectionSlug}`
	)
	const sidebarSections = buildCategorizedWafSidebar(
		allWafCollections,
		wafContent.sidebarCategories,
		currentCollection.slug
	)
	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: wafData.name, url: `/${wafData.slug}` },
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
				wafName: wafData.name,
				wafSlug: wafData.slug,
			},
			collection: currentCollection,
			layoutProps: {
				sidebarSections,
				breadcrumbLinks,
			},
		}),
	}
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(wafData.slug)
	const paths = allCollections.map((c: ApiCollection) => ({
		params: { collectionSlug: splitProductFromFilename(c.slug) },
	}))

	return {
		paths: paths.slice(0, __config.learn.max_static_paths ?? 0),
		fallback: 'blocking',
	}
}

export default WellArchitectedFrameworkCollectionView
