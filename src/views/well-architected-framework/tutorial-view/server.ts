/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { serializeContent } from 'views/tutorial-view/utils/serialize-content'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import { getCollectionContext } from 'views/tutorial-view/utils/get-collection-context'
import wafData from 'data/well-architected-framework.json'
import wafContent from 'content/well-architected-framework/index.json'
import { buildCategorizedWafSidebar } from 'views/well-architected-framework/utils/generate-sidebar-items'
import {
	Collection as ApiCollection,
	TutorialLite as ApiTutorialLite,
} from 'lib/learn-client/types'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { MenuItem, SidebarProps } from 'components/sidebar'
import { EnrichedNavItem } from 'components/sidebar/types'
import { generateWafCollectionSidebar } from 'views/well-architected-framework/utils/generate-collection-sidebar'
import { getNextPrevious } from 'views/tutorial-view/components'
import outlineItemsFromHeadings from 'components/outline-nav/utils/outline-items-from-headings'
import { WafTutorialViewProps } from '../types'

export async function getWafTutorialViewProps(
	tutorialSlug: [string, string]
): Promise<{ props: WafTutorialViewProps }> {
	const [collectionFilename, tutorialFilename] = tutorialSlug
	const currentPath = `/${wafData.slug}/${tutorialSlug.join('/')}`

	// get all the waf collections to generate the collection level sidebar
	const allWafCollections = await getCollectionsBySection(wafData.slug)
	const currentCollection = allWafCollections.find(
		(collection: ApiCollection) =>
			collection.slug === `${wafData.slug}/${collectionFilename}`
	)
	const currentTutorialReference = currentCollection?.tutorials.find((t) =>
		t.slug.endsWith(tutorialFilename)
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
	const categorizedWafCollectionSidebarItems = buildCategorizedWafSidebar(
		allWafCollections,
		wafContent.sidebarCategories,
		collectionContext.current.slug
	)
	const lastTutorialIndex = collectionContext.current.tutorials.length - 1
	const isLastTutorial =
		collectionContext.current.tutorials[lastTutorialIndex].id ===
		fullTutorialData.id
	let nextCollection

	if (isLastTutorial) {
		const filteredSidebarItems = categorizedWafCollectionSidebarItems.filter(
			(item: MenuItem) => !item.divider && !item.heading
		)
		const currentIndex = filteredSidebarItems.findIndex(
			(item: MenuItem) => item.fullPath === `/${currentCollection.slug}`
		)
		const nextSidebarItem: MenuItem = filteredSidebarItems[currentIndex + 1]
		nextCollection = allWafCollections.find((c) => nextSidebarItem?.id === c.id)
	}

	/**
	 * Generate page heading and outline nav items from headings
	 */
	const pageHeading = {
		slug: headings[0].slug,
		text: headings[0].title,
	}
	const outlineItems = outlineItemsFromHeadings(headings)

	return {
		props: stripUndefinedProperties<WafTutorialViewProps>({
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
			},
			pageHeading,
			outlineItems,
			layoutProps: {
				breadcrumbLinks: [
					{ title: 'Developer', url: '/' },
					{ title: wafData.name, url: `/${wafData.slug}` },
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
					generateTopLevelSidebarNavData(wafData.name) as SidebarProps,
					generateWafCollectionSidebar(
						wafData,
						categorizedWafCollectionSidebarItems
					),
					{
						title: wafData.name,
						visuallyHideTitle: true,
						showFilterInput: false,
						levelButtonProps: {
							levelUpButtonText: collectionContext.current.shortName,
							levelDownButtonText: fullTutorialData.name,
						},
						backToLinkProps: {
							text: collectionContext.current.shortName,
							href: `/${collectionContext.current.slug}`,
						},
						/**
						 * TODO: fix up Enriched item interfaces here.
						 *
						 * Currently, EnrichedLinkNavItem requires both `path` and `href`,
						 * since it extends both the RawInternalLinkNavItem and the
						 * RawExternalLinkNavItem interfaces.
						 */
						menuItems:
							tutorialNavLevelMenuItems as $TSFixMe as EnrichedNavItem[],
					},
				],
			},
		}),
	}
}
