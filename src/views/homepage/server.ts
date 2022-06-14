import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { getInlineContentMaps } from 'lib/tutorials/get-inline-content-maps'
import {
  FeaturedLearnCard,
  FeaturedLearnContent,
} from 'views/product-downloads-view/types'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { formatTutorialCard } from 'components/tutorial-card/helpers'
import {
  GenerateStaticPropsOptions,
  GenerateStaticPropsOptionsResult,
} from './types'

const generateStaticProps = async ({
  featuredLearnContent = [],
}: GenerateStaticPropsOptions): Promise<GenerateStaticPropsOptionsResult> => {
  // Gather tutorials and collections based on slugs used
  const { inlineCollections, inlineTutorials } = await getInlineContentMaps(
    featuredLearnContent
  )

  // Transform featured tutorial and collection entries into card data
  const featuredLearnCards: FeaturedLearnCard[] = featuredLearnContent.map(
    (entry: FeaturedLearnContent) => {
      const { collectionSlug, tutorialSlug } = entry

      // generate card for a collection
      if (typeof collectionSlug == 'string') {
        const collectionData = inlineCollections[collectionSlug]
        return { type: 'collection', ...formatCollectionCard(collectionData) }
      }

      // generate card for a tutorial
      if (typeof tutorialSlug == 'string') {
        const tutorialData = inlineTutorials[tutorialSlug]
        const defaultContext = tutorialData.collectionCtx.default
        const tutorialLiteCompat = { ...tutorialData, defaultContext }
        return { type: 'tutorial', ...formatTutorialCard(tutorialLiteCompat) }
      }
    }
  )

  return {
    props: stripUndefinedProperties({
      featuredLearnCards,
    }),
  }
}

export { generateStaticProps }
