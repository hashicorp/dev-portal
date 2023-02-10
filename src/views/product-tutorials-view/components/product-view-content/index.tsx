import { BrandedCallout } from './components'
import { ProductViewBlock, ProductViewContentProps } from './types'
import s from './product-view-content.module.css'
import LandingPageBlocks from 'components/landing-page-blocks'
import { ProductPageBlockBrandedCallout } from 'lib/learn-client/types'

function ProductViewContent({
	blocks,
}: ProductViewContentProps): React.ReactElement {
	const brandedCalloutBlock = blocks.find(
		(block) => block.type === 'BrandedCallout'
	) as ProductPageBlockBrandedCallout

	return (
		<div className={s.root}>
			<BrandedCallout
				heading={brandedCalloutBlock.heading}
				subheading={brandedCalloutBlock.subheading}
				product={brandedCalloutBlock.product}
				cta={brandedCalloutBlock.cta}
			/>
			<LandingPageBlocks
				blocks={blocks.map((block) => {
					const { type } = block

					/**
					 * Note: FeaturedStack is only ever used with LogoCardList, so could
					 * make sense here to use LogoCardList directly, and deprecate
					 * FeaturedStack as authorable (we can achieving similar things with
					 * either specific blocks like LogoCardList, or a flatter structure
					 * with less nesting - eg, heading & subheading blocks, rather than
					 * FeaturedStack with heading, subheading, & children.)
					 * Asana task:
					 * https://app.asana.com/0/0/1202182325935208/f
					 */
					if (type === 'FeaturedStack') {
						return {
							type: 'collection-card-grid',
							heading: block.heading,
							subheading: block.subheading,
							collections: block.blocks[0].collectionCards,
						}
					}

					if (type === 'TutorialsStack') {
						return {
							type: 'tutorial-card-grid',
							heading: block.heading,
							subheading: block.subheading,
							tutorials: block.tutorialCards,
						}
					}

					if (type === 'CollectionsStack') {
						return {
							type: 'collection-card-grid',
							heading: block.heading,
							subheading: block.subheading,
							collections: block.collectionCards,
						}
					}

					return block
				})}
			/>
		</div>
	)
}

export type { ProductViewBlock }
export default ProductViewContent
