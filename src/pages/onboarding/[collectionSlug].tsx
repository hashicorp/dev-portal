/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsContext } from 'next'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import {
	Collection as ClientCollection,
	TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import OnboardingCollectionView from 'views/onboarding/collection-view'
import onboardingData from 'data/onboarding.json'
import { OnboardingCollectionViewProps } from 'views/onboarding/types'

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ collectionSlug: string }>): Promise<{
	props: OnboardingCollectionViewProps
}> {
	const allOnboardingCollections = await getCollectionsBySection(
		onboardingData.slug
	)
	const currentCollection = allOnboardingCollections.find(
		(collection: ClientCollection) =>
			collection.slug === `${onboardingData.slug}/${params.collectionSlug}`
	)

	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{
			title: currentCollection.name,
			url: `/${currentCollection.slug}`,
			isCurrentPage: true,
		},
	]
	const sidebarSections = currentCollection.tutorials.map(
		(tutorial: ClientTutorialLite) => ({
			title: tutorial.name,
			isActive: false,
			fullPath: `/${currentCollection.slug}/${splitProductFromFilename(
				tutorial.slug
			)}`,
			id: tutorial.id,
		})
	)

	return {
		props: stripUndefinedProperties<$TSFixMe>({
			collection: currentCollection,
			layoutProps: { breadcrumbLinks, sidebarSections },
			metadata: {
				title: currentCollection.name,
				onboardingName: onboardingData.name,
				onboardingSlug: onboardingData.slug,
			},
		}),
	}
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(onboardingData.slug)
	const paths = allCollections.map((c: ClientCollection) => {
		return {
			params: { collectionSlug: splitProductFromFilename(c.slug) },
		}
	})

	return {
		paths: paths.slice(0, __config.learn.max_static_paths ?? 0),
		fallback: 'blocking',
	}
}

export default OnboardingCollectionView
