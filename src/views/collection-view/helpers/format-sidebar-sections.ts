import {
  Collection as ClientCollection,
  CollectionCategoryOption,
} from 'lib/learn-client/types'
import { getCollectionSlug } from './get-slug'

export interface CollectionCategorySidebarSection {
  title: CollectionCategoryOption
  routes: { title: string; href: string; isActive: boolean }[]
}

/**
 * This function creates an array of collection category
 * sections for the sidebar. The sections include the associated
 * collections with that category. The collection category order
 * and options are linked to the `CollectionCategoryOption` enum
 */
export function formatSidebarCategorySections(
  collections: ClientCollection[],
  currentSlug: string
): CollectionCategorySidebarSection[] {
  const categorySlugs = Object.keys(CollectionCategoryOption)

  const sidebarSectionsByCategory = categorySlugs.map(
    (category: CollectionCategoryOption) => {
      // get collections associated with that category
      const items = collections.filter(
        (c: ClientCollection) => c.category === category
      )

      return {
        title: CollectionCategoryOption[category],
        routes: items.map((collection: ClientCollection) =>
          formatCollectionToListItem(collection, currentSlug)
        ),
      }
    }
  )

  return filterEmptySections(sidebarSectionsByCategory)
}

function filterEmptySections(
  sections: CollectionCategorySidebarSection[]
): CollectionCategorySidebarSection[] {
  return sections.filter((c) => c.routes.length > 0)
}

function formatCollectionToListItem(
  collection: ClientCollection,
  currentSlug: string
): { title: string; href: string; isActive: boolean } {
  const path = getCollectionSlug(collection.slug)
  return {
    title: collection.shortName,
    href: path,
    isActive: collection.slug === currentSlug,
  }
}
