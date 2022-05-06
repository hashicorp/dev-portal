import { ProductData } from 'types/products'
// raw content types
import { ProductLandingContent, ProductLandingContentBlock } from '../schema'
// component prop utilities & types
import { makeHeadingSlugScope } from './'
import { ProductLandingViewProps } from '../types'
import { ProductLandingBlock } from '../components/product-landing-blocks/types'

export async function transformRawContentToProp(
  { hero, overview, get_started, blocks }: ProductLandingContent,
  product: ProductData
): Promise<ProductLandingViewProps['content']> {
  /**
   * Set up a function to make heading slugs, while avoiding duplicates
   */
  const makeHeadingSlug = makeHeadingSlugScope()

  /**
   * Build HeroHeadingVisualProps
   */
  const heroProps = { ...hero, productSlug: product.slug }

  /**
   * Build OverviewCtaProps
   */
  const overviewCtaProps = {
    ...overview,
    headingSlug: makeHeadingSlug(overview.heading),
  }

  /**
   * Build GetStartedCardProps
   */
  const getStartedProps = {
    ...get_started,
    headingSlug: makeHeadingSlug(get_started.heading),
  }

  /**
   * Build ProductLandingBlock[]
   */
  const transformedBlocks: ProductLandingBlock[] = blocks.map(
    (block: ProductLandingContentBlock) => {
      const { type } = block
      switch (type) {
        case 'heading':
          return { ...block, headingSlug: makeHeadingSlug(block.heading) }
        default:
          return block
      }
    }
  )

  return {
    hero: heroProps,
    overview: overviewCtaProps,
    get_started: getStartedProps,
    blocks: transformedBlocks,
  }
}
