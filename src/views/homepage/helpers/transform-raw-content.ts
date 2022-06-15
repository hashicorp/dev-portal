import { getInlineContentMaps } from 'lib/tutorials/get-inline-content-maps'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { HomePageContentProps } from '../types'
import { HomePageAuthoredContent } from '../content-schema'

/**
 * Given authored content for the home page,
 * Return a prepared props object to be passed to the home page view
 */
async function transformRawContent(
  authoredContent: HomePageAuthoredContent
): Promise<HomePageContentProps> {
  // Destructure data needed from given `authoredContent`
  const { hero, navNotice, merchandising, learnSection, preFooter } =
    authoredContent

  // For the learnSection, transform collectionSlugs to card data
  const { collectionSlugs, ...restLearnSection } = learnSection
  const { inlineCollections } = await getInlineContentMaps(learnSection)
  const collectionCards = collectionSlugs.map((slug: string) => {
    const collectionData = inlineCollections[slug]
    return formatCollectionCard(collectionData)
  })

  // Return props for the view
  return {
    hero,
    navNotice: navNotice || null,
    merchandising,
    learnSection: {
      collectionCards,
      ...restLearnSection,
    },
    preFooter,
  }
}

export { transformRawContent }
