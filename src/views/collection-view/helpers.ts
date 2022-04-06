import { splitProductFromFilename } from 'views/tutorial-view/utils'

/**
 * takes db slug format --> waypoint/intro
 * and turns it to --> waypoint/tutorials/get-started-docker/intro
 *
 * We want to make sure to use the collection product in the path as
 * that sets the proper product context. The tutorial db slug may
 * reference a different product context
 */

const BETA_PRODUCTS = ['vault', 'waypoint']

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
  const isBetaProduct = BETA_PRODUCTS.indexOf(product) === -1

  // if not a 'sanctioned product', link externally to Learn
  // interim solution for BETA where not all products are onboarded
  if (isBetaProduct) {
    return `https://learn.hashicorp.com/collections/${collectionDbSlug}`
  }

  return `/${product}/tutorials/${collectionFilename}`
}
