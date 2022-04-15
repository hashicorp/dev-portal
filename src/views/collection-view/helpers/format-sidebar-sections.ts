import {
  Collection as ClientCollection,
  CollectionCategoryOption,
} from 'lib/learn-client/types'
import { ListItemProps } from 'components/tutorials-sidebar/types'
import { getCollectionSlug } from './get-slug'

export interface CollectionCategorySidebarSection {
  title: CollectionCategoryOption
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
  currentSlug: string
): CollectionCategorySidebarSection[] {
  const categorySlugs = Object.keys(CollectionCategoryOption)

  const sidebarSectionsByCategory = categorySlugs.map(
    (category: keyof typeof CollectionCategoryOption) => {
      // get collections associated with that category
      const items = collections.filter(
        /**
         * TODO: is the CollectionCategoryOption type on
         * ClientCollection['category'] correct? It would seem
         * that ClientCollection['category'] may not be expected to be
         * one of the enum values, but instead one of the enum keys?
         *
         * The dual conversion here is necessary to avoid a type error.
         */
        (c: ClientCollection) =>
          (c.category as $TSFixMe as keyof typeof CollectionCategoryOption) ===
          category
      )

      return {
        title: CollectionCategoryOption[category],
        items: items.map((collection: ClientCollection) =>
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
  return sections.filter((c) => c.items.length > 0)
}

function formatCollectionToListItem(
  collection: ClientCollection,
  currentSlug: string
): ListItemProps {
  const path = getCollectionSlug(collection.slug)
  return {
    text: collection.shortName,
    href: path,
    isActive: collection.slug === currentSlug,
  }
}
