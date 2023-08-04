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
	Collection as ClientCollection,
	TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { SidebarProps } from 'components/sidebar'
import { EnrichedNavItem } from 'components/sidebar/types'
import { generateWafCollectionSidebar } from 'views/well-architected-framework/utils/generate-collection-sidebar'
import { getNextPrevious } from 'views/tutorial-view/components'
import outlineItemsFromHeadings from 'components/outline-nav/utils/outline-items-from-headings'
import { getTutorialViewVariantData } from 'views/tutorial-view/utils/variants'
import { WafTutorialViewProps } from '../types'

export async function getWafTutorialViewProps(
	fullSlug: [string, string] | [string, string, string] // Third option is a variant
): Promise<{ props: WafTutorialViewProps }> {
	// Remove the variant from the slug
	const tutorialSlug = fullSlug.slice(0, 2) as [string, string]
	const [collectionFilename, tutorialFilename] = tutorialSlug
	const currentPath = `/${wafData.slug}/${tutorialSlug.join('/')}`

	// get all the waf collections to generate the collection level sidebar
	const allWafCollections = await getCollectionsBySection(wafData.slug)
	const currentCollection = allWafCollections.find(
		(collection: ClientCollection) =>
			collection.slug === `${wafData.slug}/${collectionFilename}`
	)
	const currentTutorialReference = currentCollection?.tutorials.find(
		(t: ClientTutorialLite) =>
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
		(t: ClientTutorialLite) => {
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
			(item) => {
				/**
				 * Filter out divider and heading items, these are definitely
				 * not the "next" item.
				 *
				 * Note that tutorials sidebars will never have
				 * divider or heading items, so this is probably unnecessary.
				 * But it's here for consistency with other sidebar types.
				 * Types could potentially be refactored to reflect that
				 * tutorial sidebars only use a subset of possible `MenuItem` types.
				 */
				const isDivider = 'divider' in item
				const isHeading = 'heading' in item
				return !isDivider && !isHeading
			}
		)
		const currentIndex = filteredSidebarItems.findIndex(
			(item) =>
				'fullPath' in item && item.fullPath === `/${currentCollection.slug}`
		)
		const nextSidebarItem = filteredSidebarItems[currentIndex + 1]
		nextCollection = allWafCollections.find((c) => {
			const hasId = nextSidebarItem && 'id' in nextSidebarItem
			return hasId && nextSidebarItem.id === c.id
		})
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
