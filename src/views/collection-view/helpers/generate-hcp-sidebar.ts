import { Collection as ApiCollection } from 'lib/learn-client/types'
import { sortAlphabetically } from 'lib/sort-alphabetically'
import hcpContent from 'content/hcp/tutorials-sidebar.json'
import { getCollectionSlug } from './get-slug'
import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'

interface SidebarCategory {
	name: string
	items: { name: string; collectionSlug: string; isBeta?: boolean }[]
}

/**
 * The HCP tutorials landing and collection
 * sidebar is unique from other product sidebars.
 * The `genericHcpCollections` represent the actual
 * collections under 'cloud' in the filesystem. However,
 * there are additional cloud related collections for each
 * HCP product that we link to, but these live under their
 * specific product directory (e.g. vault/get-started-hcp )
 *
 * The additional sidebar categories to link to these product
 * collections are managed in a static JSON file in the content dir.
 *
 * This is considered an interim implementation for the GA launch.
 * Ideally, we could adjust the content structure so this sidebar
 * is generated based on the filesystem, like the other products.
 */

export function buildCategorizedHcpSidebar(
	allCollections: ApiCollection[],
	currentSlug?: string
): CollectionCategorySidebarSection[] {
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
				const badge = item.isBeta
					? {
							text: 'Beta',
							type: 'outlined',
							color: 'neutral',
					  }
					: undefined
				return {
					text: item.name,
					href,
					badge,
					isActive: false, // these will never be active in the hcp context, they exist under other products
				}
			}),
		})
	)

	return [...genericHcpCollections, ...categorizedNonHcpCollections]
}
