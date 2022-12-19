/* eslint-disable react/no-array-index-key */
import CalloutCard from 'components/callout-card'
import { ProductLandingBlocksProps, ProductLandingBlock } from './types'
import {
	CollectionCards,
	HeadingBlock,
	LinkedCards,
	TutorialCards,
} from './blocks'
import s from './product-landing-blocks.module.css'

function ProductLandingBlocks({ blocks }: ProductLandingBlocksProps) {
	return (
		<>
			{blocks.map((block: ProductLandingBlock, idx: number) => {
				const { type } = block
				switch (type) {
					case 'callout':
						return (
							<div key={idx} className={s.calloutCardMargin}>
								<CalloutCard
									heading={block.heading}
									headingSlug={block.headingSlug}
									body={block.body}
									ctas={block.ctas}
									iconCardLinks={block.iconCardLinks}
								/>
							</div>
						)
					case 'heading':
						return (
							<div key={idx} className={s.headingMargin}>
								<HeadingBlock
									heading={block.heading}
									headingSlug={block.headingSlug}
								/>
							</div>
						)
					case 'tutorial_cards':
						return (
							<div key={idx} className={s.cardsMargin}>
								<TutorialCards tutorialCards={block.tutorialCards} />
							</div>
						)
					case 'collection_cards':
						return (
							<div key={idx} className={s.cardsMargin}>
								<CollectionCards collectionCards={block.collectionCards} />
							</div>
						)
					case 'linked_cards':
						return (
							<div key={idx} className={s.cardsMargin}>
								<LinkedCards cards={block.cards} />
							</div>
						)
					default:
						/**
						 * Note: any invalid block types are expected to have been caught
						 * by server-side validation against our content schema.
						 * At this point, we don't want to throw an error...
						 * so we render null for unrecognized block types.
						 */
						return null
				}
			})}
		</>
	)
}

export default ProductLandingBlocks
