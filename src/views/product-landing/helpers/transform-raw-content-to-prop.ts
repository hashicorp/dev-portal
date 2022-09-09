import { ProductData } from 'types/products'
// raw content types
import { ProductLandingContent, ProductLandingContentBlock } from '../schema'
// component prop utilities & types
import { formatTutorialCard } from 'components/tutorial-card/helpers'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { getInlineContentMaps } from 'lib/tutorials/get-inline-content-maps'
import { makeHeadingSlugScope } from './'
import { ProductLandingViewProps } from '../types'
import { ProductLandingBlock } from '../components/product-landing-blocks/types'

export async function transformRawContentToProp(
	{
		hero,
		overview,
		overviewParagraph,
		get_started,
		blocks,
	}: ProductLandingContent,
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
	const INLINE_CONTENT = await getInlineContentMaps(blocks)
	const transformedBlocks: ProductLandingBlock[] = blocks.map(
		(block: ProductLandingContentBlock) => {
			const { type } = block
			switch (type) {
				case 'heading':
					return { ...block, headingSlug: makeHeadingSlug(block.heading) }
				case 'tutorial_cards':
					return {
						type: block.type,
						tutorialCards: block.tutorialSlugs.map((slug: string) => {
							const tutorial = INLINE_CONTENT.inlineTutorials[slug]
							const defaultContext = tutorial.collectionCtx.default
							const tutorialLiteCompat = { ...tutorial, defaultContext }
							return formatTutorialCard(tutorialLiteCompat)
						}),
					}
				case 'collection_cards':
					return {
						type: block.type,
						collectionCards: block.collectionSlugs.map((slug: string) => {
							const collection = INLINE_CONTENT.inlineCollections[slug]
							return formatCollectionCard(collection)
						}),
					}
				default:
					return block
			}
		}
	)

	return {
		hero: heroProps,
		overview: overviewCtaProps,
		overviewParagraph,
		get_started: getStartedProps,
		blocks: transformedBlocks,
	}
}
