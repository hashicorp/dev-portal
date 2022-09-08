import { MenuItem } from 'components/sidebar'
import { EnrichedNavItem } from 'components/sidebar/types'
import { Collection as ApiCollection, Collection } from 'lib/learn-client/types'
import { sortAlphabetically } from 'lib/sort-alphabetically'
import hcpContent from 'content/hcp/tutorial-landing.json'
import { getCollectionSlug } from './get-slug'
import { CollectionCategorySidebarSection } from './format-sidebar-sections'

interface SidebarCategory {
	name: string
	items: { name: string; collectionSlug: string }[]
}

interface HcpCollectionCategorySidebarSection
	extends Pick<CollectionCategorySidebarSection, 'items'> {
	title?: string
}

export function buildCategorizedHcpSidebar(
	allCollections: ApiCollection[],
	currentSlug?: string
): HcpCollectionCategorySidebarSection[] {
	// take all collections, make those generic in the first list
	// take the rest of the categories and build the item based on that
	const genericHcpCollections = [
		{
			title: 'HashiCorp Cloud Platform',
			items: allCollections
				.sort(sortAlphabetically('name'))
				.map((collection: ApiCollection) => {
					const href = getCollectionSlug(collection.slug)
					return {
						text: collection.name,
						href,
						isActive: collection.slug === currentSlug,
					}
				}),
		},
	]

	const categorizedNonHcpCollections = hcpContent.sidebarCategories.map(
		(category: SidebarCategory) => ({
			title: category.name,
			items: category.items.map((item) => {
				const href = getCollectionSlug(item.collectionSlug)
				return {
					text: item.name,
					href,
					isActive: false,
				}
			}),
		})
	)

	return [...genericHcpCollections, ...categorizedNonHcpCollections]
}
