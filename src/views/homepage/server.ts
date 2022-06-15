import { formatCollectionCard } from 'components/collection-card/helpers'
import { HomePageAuthoredContent, HomePageProps } from './types'
import { getInlineContentMaps } from 'lib/tutorials/get-inline-content-maps'

const generateStaticProps = async (
  authoredContent: HomePageAuthoredContent
): Promise<{ props: HomePageProps }> => {
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
    props: {
      content: {
        hero,
        navNotice,
        merchandising,
        learnSection: {
          collectionCards,
          ...restLearnSection,
        },
        preFooter,
      },
    },
  }
}

export { generateStaticProps }
