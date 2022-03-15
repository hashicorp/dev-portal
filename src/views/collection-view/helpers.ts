import { splitProductFromFilename } from 'views/tutorial-view/helpers'

/**
 * takes db slug format --> waypoint/intro
 * and turns it to --> waypoint/tutorials/get-started-docker/intro
 */

export function getTutorialSlug(
  dbslug: string,
  collectionSlug: string
): string {
  const [product, tutorialFilename] = dbslug.split('/')
  const collectionFilename = splitProductFromFilename(collectionSlug)
  return `/${product}/tutorials/${collectionFilename}/${tutorialFilename}`
}
