import { useCurrentProduct } from 'contexts'
import Heading from 'components/heading'
import Text from 'components/text'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import TruncateMaxLines from 'components/truncate-max-lines'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'
import s from './marketing-content.module.css'
import { SUPPORTED_ICONS } from '../supported-icons'

const ProductRootDocsPathLandingMarketingContent = ({ blocks }) => {
  const currentProduct = useCurrentProduct()

  return (
    <div>
      {blocks.map((block) => {
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

        if (block.type === 'icon-card-grid') {
          return (
            <IconCardLinkGridList
              cards={block.cards.map(({ iconName, text, url }) => ({
                icon: SUPPORTED_ICONS[iconName],
                text,
                url,
              }))}
              productSlug={currentProduct.slug}
            />
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
  )
}

export default ProductRootDocsPathLandingMarketingContent
