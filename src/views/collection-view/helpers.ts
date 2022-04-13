import { LearnProductSlug } from 'types/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import {
  Collection as ClientCollection,
  CollectionCategoryOption,
} from 'lib/learn-client/types'
import { MenuItem } from 'components/sidebar'

/**
 * takes db slug format --> waypoint/intro
 * and turns it to --> waypoint/tutorials/get-started-docker/intro
 *
 * We want to make sure to use the collection product in the path as
 * that sets the proper product context. The tutorial db slug may
 * reference a different product context
 */

export function getTutorialSlug(
  tutorialDbSlug: string,
  collectionDbSlug: string
): string {
  const [product, collectionFilename] = collectionDbSlug.split('/')
  const tutorialFilename = splitProductFromFilename(tutorialDbSlug)
  return `/${product}/tutorials/${collectionFilename}/${tutorialFilename}`
}

export function getCollectionSlug(collectionDbSlug: string): string {
  const [product, collectionFilename] = collectionDbSlug.split('/')
  const isBetaProduct = getIsBetaProduct(product as LearnProductSlug)

  // if not a 'sanctioned product', link externally to Learn
  // interim solution for BETA where not all products are onboarded
  if (!isBetaProduct) {
    return `https://learn.hashicorp.com/collections/${collectionDbSlug}`
  }

  return `/${product}/tutorials/${collectionFilename}`
}

export interface SidebarSection {
  title: CollectionCategoryOption
  items: ClientCollection[]
}

export function collectionsToSidebarSections(
  collections: ClientCollection[]
): SidebarSection[] {
  const categorySlugs = Object.keys(CollectionCategoryOption)

  const sidebarSectionsByCategory = categorySlugs.map(
    (category: CollectionCategoryOption) => {
      // get collections associated with that category
      const items = collections.filter(
        (c: ClientCollection) => c.category === category
      )

      return {
        title: CollectionCategoryOption[category],
        items,
      }
    }
  )

  return filterEmptySections(sidebarSectionsByCategory)
}

function filterEmptySections(sections) {
  return sections.filter((c) => c.items.length > 0)
}

export function formatCollectionToMenuItem(
  collection: ClientCollection,
  currentPath
): MenuItem {
  const path = getCollectionSlug(collection.slug)
  return {
    title: collection.shortName,
    fullPath: path,
    id: collection.id,
    isActive: path === currentPath,
  }
}
