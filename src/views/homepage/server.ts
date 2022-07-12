import { Collection } from 'lib/learn-client/types'
import { getCollections } from 'lib/learn-client/api/collection'
import { formatCollectionCard } from 'components/collection-card/helpers'
import {
  GenerateStaticPropsOptions,
  GenerateStaticPropsOptionsResult,
} from './types'

const generateStaticProps = async (
  pageContent: GenerateStaticPropsOptions
): Promise<GenerateStaticPropsOptionsResult> => {
  // Destructure data needed from given `pageContent`
  const { collectionSlugs } = pageContent

  // Check that `collectionSlugs` have been specified
  if (!collectionSlugs || collectionSlugs.length <= 0) {
    throw new Error(
      '`HomePageView` requires `collectionSlugs` to be defined in `src/pages/content.json` but none were provided.'
    )
  }

  // Fetch the collections specified
  const collections = await getCollections(collectionSlugs)

  // Transform collection entries into card data with `collectionSlugs` order
  const collectionCards = collectionSlugs.map((collectionSlug: string) => {
    const thisCollection = collections.find(
      (collection: Collection) => collection.slug === collectionSlug
    )
    return formatCollectionCard(thisCollection)
  })

  // Return props for the view
  return {
    props: {
      collectionCards,
    },
  }
}

export { generateStaticProps }
