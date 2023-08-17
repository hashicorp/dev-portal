/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPropsContext } from 'next'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import {
	Collection as ApiCollection,
	TutorialLite as ApiTutorialLite,
} from 'lib/learn-client/types'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import onboardingData from 'data/onboarding.json'
import { getOnboardingTutorialProps } from 'views/onboarding/tutorial-view/server'
import OnboardingTutorialView from 'views/onboarding/tutorial-view'
import { OnboardingTutorialViewProps } from 'views/onboarding/types'
import { getStaticPathsFromAnalytics } from 'lib/get-static-paths-from-analytics'

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ tutorialSlug: [string, string] }>): Promise<
	{ props: OnboardingTutorialViewProps } | { notFound: boolean }
> {
	const props = await getOnboardingTutorialProps(params.tutorialSlug)

	// If the tutorial doesn't exist, hit the 404
	if (!props) {
		return { notFound: true }
	}
	return props
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(onboardingData.slug)
	let paths = []
	allCollections.forEach((c: ApiCollection) => {
		const collectionSlug = splitProductFromFilename(c.slug)
		c.tutorials.forEach(({ slug }: { slug: ApiTutorialLite['slug'] }) =>
			paths.push({
				params: {
					tutorialSlug: [collectionSlug, splitProductFromFilename(slug)],
				},
			})
		)
	})

	// For hashicorp/tutorials PR previews, skip the call to determine paths
	// from analytics, and statically build all paths.
	if (process.env.HASHI_ENV === 'tutorials-preview') {
		return {
			paths: paths,
			fallback: false,
		}
	}

	try {
		paths = await getStaticPathsFromAnalytics({
			param: 'tutorialSlug',
			limit: __config.learn.max_static_paths ?? 0,
			pathPrefix: `/onboarding`,
			validPaths: paths,
		})
	} catch {
		// In the case of an error, fallback to using the base list of generated paths to ensure we do _some_ form of static generation
		paths = paths.slice(0, __config.learn.max_static_paths ?? 0)
	}

	return { paths, fallback: 'blocking' }
}

export default OnboardingTutorialView
