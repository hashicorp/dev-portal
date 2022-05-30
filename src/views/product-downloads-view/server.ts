import { GetStaticPropsResult } from 'next'
import { ProductData } from 'types/products'
import { generateStaticProps as generateReleaseStaticProps } from 'lib/fetch-release-data'
import { getInlineContentMaps } from 'lib/tutorials/get-inline-content-maps'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { formatTutorialCard } from 'components/tutorial-card/helpers'
import {
  FeaturedTutorialContent,
  ProductDownloadsViewStaticProps,
  RawProductDownloadsViewContent,
  FeaturedTutorialCard,
} from './types'

/**
 * Prepares static props for downloads views
 */
async function generateStaticProps(
  productData: ProductData,
  pageContent: RawProductDownloadsViewContent
): Promise<GetStaticPropsResult<ProductDownloadsViewStaticProps>> {
  /**
   * Fetch the release data static props
   */
  const { props: releaseProps, revalidate } = await generateReleaseStaticProps(
    productData
  )
  const { releases, product, latestVersion } = releaseProps

  /**
   * Fetch page content
   * (loaded from .json, then tutorial data is fetched)
   */
  const {
    doesNotHavePackageManagers,
    featuredTutorials,
    packageManagerOverrides,
    sidecarMarketingCard,
  } = pageContent
  // Gather tutorials and collections based on slugs used
  const inlineContent = await getInlineContentMaps(featuredTutorials)
  // Transform feature tutorial and collection entries into card data
  const featuredTutorialCards: FeaturedTutorialCard[] = featuredTutorials.map(
    (entry: FeaturedTutorialContent) => {
      const { collectionSlug, tutorialSlug } = entry
      if (typeof collectionSlug == 'string') {
        const collectionData = inlineContent.inlineCollections[collectionSlug]
        return { type: 'collection', ...formatCollectionCard(collectionData) }
      } else if (typeof tutorialSlug == 'string') {
        const tutorialData = inlineContent.inlineTutorials[tutorialSlug]
        const defaultContext = tutorialData.collectionCtx.default
        const tutorialLiteCompat = { ...tutorialData, defaultContext }
        return { type: 'tutorial', ...formatTutorialCard(tutorialLiteCompat) }
      }
    }
  )

  /**
   * Combine release data and page content
   */
  return {
    props: stripUndefinedProperties({
      releases,
      product,
      latestVersion,
      pageContent: {
        doesNotHavePackageManagers,
        featuredTutorialCards,
        packageManagerOverrides,
        sidecarMarketingCard,
      },
    }),
    revalidate,
  }
}

export { generateStaticProps }
