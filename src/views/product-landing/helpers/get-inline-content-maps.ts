import gatherUniqueValues from 'lib/gather-unique-values'
import {
  getInlineCollections,
  getInlineTutorials,
  InlineCollections,
  InlineTutorials,
} from 'views/product-tutorials-view/helpers/get-inline-content'

export async function getInlineContentMaps(data: unknown): Promise<{
  inlineTutorials: InlineTutorials
  inlineCollections: InlineCollections
}> {
  // Build a map from tutorial slugs used in data, to collection content
  const inlineTutorialSlugs = (
    await gatherUniqueValues(['tutorialSlug', 'tutorialSlugs'], data)
  ).map(String)
  const inlineTutorials =
    inlineTutorialSlugs.length > 0
      ? await getInlineTutorials(inlineTutorialSlugs)
      : {}
  // Build a map from collection slugs used in data, to collection content
  const inlineCollectionSlugs = (
    await gatherUniqueValues(['collectionSlug', 'collectionSlugs'], data)
  ).map(String)
  const inlineCollections =
    inlineCollectionSlugs.length > 0
      ? await getInlineCollections(inlineCollectionSlugs)
      : {}
  // Return the two maps
  return { inlineTutorials, inlineCollections }
}
