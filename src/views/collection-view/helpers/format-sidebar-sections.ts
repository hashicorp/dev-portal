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

export function collectionsToSidebarSections(
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
        items: items.map((collection) =>
          formatCollectionToSectionItem(collection, currentSlug)
        ),
      }
    }
  )

  return filterEmptySections(sidebarSectionsByCategory)
}

function filterEmptySections(sections) {
  return sections.filter((c) => c.items.length > 0)
}

function formatCollectionToSectionItem(
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
