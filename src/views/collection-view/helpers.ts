import { splitProductFromFilename } from 'views/tutorial-view/helpers'

export function getTutorialSlug(
  dbslug: string,
  collectionSlug: string
): string {
  const [product, tutorialFilename] = dbslug.split('/')
  const collectionFilename = splitProductFromFilename(collectionSlug)
  return `/${product}/tutorials/${collectionFilename}/${tutorialFilename}`
}
