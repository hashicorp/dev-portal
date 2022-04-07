import { Collection as ClientCollection } from 'lib/learn-client/types'

/**
 * This function is an interim solution for filtering content from the /onboarding dir
 * to render on the frontend - esp in the product sitemaps and featured products options
 *
 * This function also filters collections that don't have the product as the main theme
 */

export function filterCollections(collections, theme) {
  return collections
    .filter((c) => c.theme === theme && !c.slug.includes('onboarding'))
    .sort(sortAlphabetically('name'))
}

function sortAlphabetically(
  property: keyof Pick<ClientCollection, 'shortName' | 'name'>
) {
  return (a: ClientCollection, b: ClientCollection) => {
    const A = a[property].toUpperCase()
    const B = b[property].toUpperCase()

    if (A < B) {
      return -1
    }
    if (A > B) {
      return 1
    }
    return 0
  }
}
