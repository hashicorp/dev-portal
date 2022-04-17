import {
  Collection as ClientCollection,
  CollectionCategoryOption,
} from 'lib/learn-client/types'
import { LearnProductSlug } from 'types/products'
import { MenuItem } from 'components/sidebar'
import { getCollectionSlug } from './get-slug'

/**
 * This function creates a flat array of nav items for the sidebar. It groups
 * nav items by collection category. Each group of nav items is separated by a
 * horizontal rule and heading that matches the collection category's name. The
 * collection category order and options are linked to the
 * `CollectionCategoryOption` enum.
 */
export function generateSidebarNavItems(
  collections: ClientCollection[],
  productSlug: LearnProductSlug
): MenuItem[] {
  // initialize the list of items with the static Overview item
  const sidebarNavItems: MenuItem[] = [
    { title: 'Overview', href: `/${productSlug}/tutorials` },
  ]

  // get all category slugs from CollectionCategoryOption
  const categorySlugs = Object.keys(CollectionCategoryOption)

  // for each category, get the collection nav items associated with it
  categorySlugs.forEach((categorySlug: CollectionCategoryOption) => {
    const items = []

    // push collection object to items array if its in this category
    collections.forEach((collection: ClientCollection) => {
      const isInCategory = collection.category === categorySlug
      if (isInCategory) {
        items.push(formatCollectionToMenuItem(collection))
      }
    })

    // only put this category in the sidebar if it has collections in it
    if (items.length > 0) {
      sidebarNavItems.push({ divider: true })
      sidebarNavItems.push({ heading: CollectionCategoryOption[categorySlug] })
      sidebarNavItems.push(...items)
    }
  })

  return sidebarNavItems
}

function formatCollectionToMenuItem(collection: ClientCollection): MenuItem {
  const path = getCollectionSlug(collection.slug)
  return {
    title: collection.shortName,
    href: path,
  }
}
