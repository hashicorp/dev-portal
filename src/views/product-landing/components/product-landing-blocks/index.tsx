/* eslint-disable react/no-array-index-key */
import { ProductLandingBlocksProps, ProductLandingBlock } from './types'
import { HeadingBlock, LinkedCards, TutorialCards } from './blocks'

function ProductLandingBlocks({ blocks }: ProductLandingBlocksProps) {
  return (
    <>
      {blocks.map((block: ProductLandingBlock, idx: number) => {
        const { type } = block
        switch (type) {
          case 'heading':
            return (
              <HeadingBlock
                key={idx}
                heading={block.heading}
                headingSlug={block.headingSlug}
              />
            )
          case 'tutorial_cards':
            return (
              <TutorialCards key={idx} tutorialSlugs={block.tutorialSlugs} />
            )
          case 'linked_cards':
            return <LinkedCards key={idx} cards={block.cards} />
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
