/**
 * @TODO organize imports
 */
import ProductDocsSearch from 'views/docs-view/components/product-docs-search'
import Heading from 'components/heading'
import Text from 'components/text'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import TruncateMaxLines from 'components/truncate-max-lines'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'
import { ReactElement } from 'react'
import ProductRootDocsPathLandingHero from './components/hero'
import s from './product-root-docs-path-landing.module.css'

interface ProductRootDocsPathLandingProps {
  mdxSlot?: ReactElement
  pageContent: {
    pageSubtitle: string
    // TODO create a block type
    marketingContentBlocks: any[]
  }
}

const ProductRootDocsPathLanding = ({
  mdxSlot,
  pageContent,
}: ProductRootDocsPathLandingProps) => {
  const { pageSubtitle, marketingContentBlocks } = pageContent
  const showProductDocsSearch = __config.flags.enable_product_docs_search

  return (
    <>
      {showProductDocsSearch && <ProductDocsSearch />}
      <ProductRootDocsPathLandingHero pageSubtitle={pageSubtitle} />
      {mdxSlot}
      <div>
        {marketingContentBlocks.map((block) => {
          if (block.type === 'section-heading') {
            return (
              <Heading
                className={devDotStyles.h2}
                level={2}
                size={400}
                weight="bold"
              >
                {block.title}
              </Heading>
            )
          }

          if (block.type === 'card-grid') {
            // TODO move to a separate component
            const hasTitle = Boolean(block.title)
            const hasDescription = Boolean(block.description)

            return (
              <div>
                {hasTitle && (
                  <Heading
                    className={devDotStyles.h3}
                    level={3}
                    size={300}
                    weight="bold"
                  >
                    {block.title}
                  </Heading>
                )}
                {hasDescription && (
                  <Text size={300} weight="regular">
                    {block.description}
                  </Text>
                )}
                <CardsGridList>
                  {block.cards.map((card) => (
                    <li key={card.url}>
                      <CardLink className={s.cardGridCard} href={card.url}>
                        <Text
                          className={s.cardGridCardTitle}
                          size={200}
                          weight="semibold"
                        >
                          {card.title}
                        </Text>
                        <Text
                          className={s.cardGridCardDescription}
                          size={100}
                          weight="regular"
                        >
                          <TruncateMaxLines
                            maxLines={3}
                            lineHeight="var(--token-typography-body-100-line-height)"
                          >
                            {card.description}
                          </TruncateMaxLines>
                        </Text>
                      </CardLink>
                    </li>
                  ))}
                </CardsGridList>
              </div>
            )
          }
        })}
      </div>
    </>
  )
}

export default ProductRootDocsPathLanding
