import {
	Collection as ClientCollection,
	CollectionCategoryOption,
} from 'lib/learn-client/types'
import { ListItemProps } from 'components/tutorials-sidebar/types'
import { getCollectionSlug } from './get-slug'

export interface CollectionCategorySidebarSection {
	title?: string
	items: ListItemProps[]
}

/**
 * This function creates an array of collection category
 * sections for the sidebar. The sections include the associated
 * collections with that category. The collection category order
 * and options are linked to the `CollectionCategoryOption` enum
 */
export function formatSidebarCategorySections(
	collections: ClientCollection[],
	currentSlug?: string
): CollectionCategorySidebarSection[] {
	const categorySlugs = Object.keys(CollectionCategoryOption)

	/**
	 * Track which collections have been used in sidebar categories,
	 * so that we can ensure any non-categorized collections are still displayed.
	 */
	const usedCollections = []

	const sidebarSectionsByCategory = categorySlugs.map(
		(category: CollectionCategoryOption) => {
			// get collections associated with that category
			const items = collections.filter((c: ClientCollection) => {
				const isInCategory = c.category === category
				if (isInCategory) {
					usedCollections.push(c.slug)
				}
				return isInCategory
			})

			return {
				title: CollectionCategoryOption[category],
				items: items.map((collection: ClientCollection) =>
					formatCollectionToListItem(collection, currentSlug)
				),
			}
		}
	)

	/**
	 * If we have category sections with content, use those.
	 */
	const nonEmptySections = filterEmptySections(sidebarSectionsByCategory)
	if (nonEmptySections.length > 0) {
		return nonEmptySections
	}

	/**
	 * Otherwise, since there are no other sidebar sections, then
	 * add an "unused" section, to capture any missing collections
	 * Note: this will be filtered out if it's empty.
	 *
	 * TODO: this is to get /hcp content stubbed, may not be correct,
	 * and may need adjustment once we have finalized designs.
	 */
	const remainderCollections = collections.filter((c: ClientCollection) => {
		return usedCollections.indexOf(c.slug) == -1
	})
	const remainderSection = {
		/**
		 * Note: section title is not included, only option I can think of
		 * is "Collections", which I think we want to avoid naming explicitly?
		 * And would look weird next to other more specifically named sections.
		 */
		items: remainderCollections.map((collection: ClientCollection) =>
			formatCollectionToListItem(collection, currentSlug)
		),
	}
	return filterEmptySections([remainderSection])
}

function filterEmptySections(
	sections: CollectionCategorySidebarSection[]
): CollectionCategorySidebarSection[] {
	return sections.filter((c) => c.items.length > 0)
}

function formatCollectionToListItem(
	collection: ClientCollection,
	currentSlug?: string
): ListItemProps {
	const path = getCollectionSlug(collection.slug)
	return {
		text: collection.shortName,
		href: path,
		isActive: collection.slug === currentSlug,
	}
}
