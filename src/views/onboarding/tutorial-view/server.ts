/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import {
	Collection as ApiCollection,
	TutorialLite as ApiTutorialLite,
} from 'lib/learn-client/types'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import onboardingData from 'data/onboarding.json'

import { serializeContent } from 'views/tutorial-view/utils/serialize-content'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { getCollectionContext } from 'views/tutorial-view/utils/get-collection-context'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { MenuItem, SidebarProps } from 'components/sidebar'
import { EnrichedNavItem } from 'components/sidebar/types'
import outlineItemsFromHeadings from 'components/outline-nav/utils/outline-items-from-headings'
import { getNextPrevious } from 'views/tutorial-view/components'
import { getTutorialViewVariantData } from 'views/tutorial-view/utils/variants'
import { OnboardingTutorialViewProps } from '../types'

/**
 * TODO - there is a lot of shared logic
 * between this file and the well-architected-framework
 * tutorial prop generation function. In the future, we
 * should create a shared abstraction for these generic
 * tutorial views - https://app.asana.com/0/1202097197789424/1202900693486009
 */

export async function getOnboardingTutorialProps(
	fullSlug: [string, string] | [string, string, string] // Third option is a variant
): Promise<{ props: OnboardingTutorialViewProps }> {
	// Remove the variant from the slug
	const tutorialSlug = fullSlug.slice(0, 2) as [string, string]
	const [collectionFilename, tutorialFilename] = tutorialSlug
	const currentPath = `/${onboardingData.slug}/${tutorialSlug.join('/')}`

	// get all the onboarding collections to generate the collection level sidebar
	const allOnboardingCollections = await getCollectionsBySection(
		onboardingData.slug
	)
	const currentCollection = allOnboardingCollections.find(
		(collection: ApiCollection) =>
			collection.slug === `${onboardingData.slug}/${collectionFilename}`
	)
	const currentTutorialReference = currentCollection?.tutorials.find(
		(t: ApiTutorialLite) =>
			tutorialFilename === splitProductFromFilename(t.slug)
	)

	// The tutorial doesn't exist in collection - return 404
	if (!currentCollection || !currentTutorialReference) {
		return null
	}

	// Need to get tutorial data with full mdx content
	const fullTutorialData = await getTutorial(currentTutorialReference.slug)

	// Double guard if tutorial doesn't exist after call - return 404
	if (fullTutorialData === null) {
		return null
	}

	const variantSlug = fullSlug[2]
	const variant = getTutorialViewVariantData(
		variantSlug,
		fullTutorialData.variant
	)

	const { content: serializedContent, headings } = await serializeContent(
		fullTutorialData
	)
	const collectionContext = getCollectionContext(
		currentCollection,
		fullTutorialData.collectionCtx
	)
	const tutorialNavLevelMenuItems = collectionContext.current.tutorials.map(
		(t: ApiTutorialLite) => {
			const fullTutorialPath = `/${
				collectionContext.current.slug
			}/${splitProductFromFilename(t.slug)}`

			return {
				title: t.name,
				id: t.id,
				fullPath: fullTutorialPath,
				isActive: currentPath === fullTutorialPath,
			}
		}
	)

	const lastTutorialIndex = collectionContext.current.tutorials.length - 1
	const isLastTutorial =
		collectionContext.current.tutorials[lastTutorialIndex].id ===
		fullTutorialData.id
	let nextCollection

	// handle next sidebar collection logic
	if (isLastTutorial) {
		const currentIndex = tutorialNavLevelMenuItems.findIndex(
			(item: MenuItem) => item.fullPath === `/${currentCollection.slug}`
		)
		const nextSidebarItem: MenuItem =
			tutorialNavLevelMenuItems[currentIndex + 1]
		nextCollection = allOnboardingCollections.find(
			(c) => nextSidebarItem?.id === c.id
		)
	}

	/**
	 * Generate page heading and outline nav items from headings
	 */
	const pageHeading = {
		slug: headings[0].slug,
		text: headings[0].title,
	}
	const outlineItems = outlineItemsFromHeadings(headings)

	/**
	 * Assemble props for the view
	 */
	const props = stripUndefinedProperties<OnboardingTutorialViewProps>({
		metadata: {
			title: fullTutorialData.name,
		},
		tutorial: {
			...fullTutorialData,
			content: serializedContent,
			collectionCtx: collectionContext,
			nextPreviousData: getNextPrevious({
				currentCollection: collectionContext.current,
				currentTutorialSlug: fullTutorialData.slug,
				nextCollectionInSidebar: nextCollection,
				formatting: {
					getCollectionSlug: (collectionSlug: string) => `/${collectionSlug}`,
					getTutorialSlug: (tutorialSlug: string, collectionSlug: string) =>
						`/${collectionSlug}/${splitProductFromFilename(tutorialSlug)}`,
				},
			}),
			variant,
		},
		pageHeading,
		outlineItems,
		layoutProps: {
			breadcrumbLinks: [
				{ title: 'Developer', url: '/' },
				{
					title: collectionContext.current.name,
					url: `/${collectionContext.current.slug}`,
				},
				{
					title: fullTutorialData.name,
					url: `/${collectionContext.current.slug}/${splitProductFromFilename(
						fullTutorialData.slug
					)}`,
					isCurrentPage: true,
				},
			],
			navLevels: [
				generateTopLevelSidebarNavData(onboardingData.name) as SidebarProps,
				{
					title: onboardingData.name,
					levelButtonProps: {
						levelUpButtonText: `Main Menu`,
						levelDownButtonText: 'Previous',
					},
					showFilterInput: false,
					/**
					 * TODO: fix up Enriched item interfaces here.
					 *
					 * Currently, EnrichedLinkNavItem requires both `path` and `href`,
					 * since it extends both the RawInternalLinkNavItem and the
					 * RawExternalLinkNavItem interfaces.
					 */
					menuItems: tutorialNavLevelMenuItems as $TSFixMe as EnrichedNavItem[],
					backToLinkProps: {
						text: `${currentCollection.name}`,
						href: `/${currentCollection.slug}`,
					},
				},
			],
		},
	})

	return { props }
}
