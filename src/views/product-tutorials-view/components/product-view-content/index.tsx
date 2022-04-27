import {
  TutorialsStack,
  CollectionsStack,
  FeaturedStack,
  BrandedCallout,
  LogoCardList,
} from './components'
import { ProductViewBlock, ProductViewContentProps } from './types'

const SUPPORTED_BLOCK_TYPES = [
  'BrandedCallout',
  'CardList',
  'CollectionsStack',
  'FeaturedStack',
  'TutorialsStack',
]

function ProductViewContent({
  blocks,
  inlineCollections,
  inlineTutorials,
}: ProductViewContentProps): React.ReactElement {
  return (
    <div>
      {blocks.map((block: ProductViewBlock, idx: number) => {
        switch (block.type) {
          case 'FeaturedStack':
            return (
              <FeaturedStack
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                heading={block.heading}
                subheading={block.subheading}
              >
                <ProductViewContent
                  blocks={block.blocks as ProductViewBlock[]}
                  inlineCollections={inlineCollections}
                  inlineTutorials={inlineTutorials}
                />
              </FeaturedStack>
            )
          case 'BrandedCallout':
            return (
              <BrandedCallout
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                heading={block.heading}
                subheading={block.subheading}
                product={block.product}
                cta={block.cta}
              />
            )
          case 'CardList':
            return (
              <LogoCardList
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                items={block.items.map((item) => {
                  return {
                    logo: item.logo,
                    collection: inlineCollections[item.collectionSlug],
                  }
                })}
              />
            )
          case 'TutorialsStack':
            return (
              <TutorialsStack
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                heading={block.heading}
                subheading={block.subheading}
                featuredTutorials={block.tutorialSlugs.map(
                  (slug) => inlineTutorials[slug]
                )}
              />
            )
          case 'CollectionsStack':
            return (
              <CollectionsStack
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                heading={block.heading}
                subheading={block.subheading}
                product={block.product}
                featuredCollections={block.collectionSlugs.map(
                  (slug) => inlineCollections[slug]
                )}
              />
            )
          default:
            // If we don't have a recognized card type,
            // throw an error. But be nice about it.
            throw new Error(
              `Unrecognized block type "${
                (block as { type: unknown }).type
              }" passed to "ProductViewContent". Please use one of the following supported block types: ${JSON.stringify(
                SUPPORTED_BLOCK_TYPES
              )}.\nUnrecognized block:\n${JSON.stringify(block, null, 2)}`
            )
        }
      })}
    </div>
  )
}

export type { ProductViewBlock }
export default ProductViewContent
