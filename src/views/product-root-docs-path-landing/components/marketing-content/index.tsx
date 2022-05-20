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

/**
 * @TODO move to a different folder/file & document
 * @TODO make Heading have default size instead of this abstraction?
 */
const SmartHeading = ({ headingLevel, text }) => {
  const levelsToSize = {
    1: 500,
    2: 400,
    3: 300,
  }

  return (
    <Heading
      className={devDotStyles[`h${headingLevel}`]}
      level={headingLevel}
      size={levelsToSize[headingLevel]}
      weight="bold"
    >
      {text}
    </Heading>
  )
}

/**
 * @TODO move to a different folder/file & document
 */
const SectionHeading = ({ headingLevel, text }) => {
  return <SmartHeading headingLevel={headingLevel} text={text} />
}

/**
 * @TODO move to a different folder/file & document
 */
const IconCardGrid = ({ cards, productSlug }) => {
  return (
    <IconCardLinkGridList
      cards={cards.map(({ iconName, text, url }) => ({
        icon: SUPPORTED_ICONS[iconName],
        text,
        url,
      }))}
      productSlug={productSlug}
    />
  )
}

/**
 * @TODO move to a different folder/file & document
 */
const CardGrid = ({ cards, description, title, headingLevel }) => {
  const hasTitle = Boolean(title)
  const hasDescription = Boolean(description)

  return (
    <div>
      {hasTitle && <SmartHeading headingLevel={headingLevel} text={title} />}
      {hasDescription && (
        <Text size={300} weight="regular">
          {description}
        </Text>
      )}
      <CardsGridList>
        {cards.map(({ description, title, url }) => (
          <li key={url}>
            <CardLink className={s.cardGridCard} href={url}>
              <Text
                className={s.cardGridCardTitle}
                size={200}
                weight="semibold"
              >
                {title}
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
                  {description}
                </TruncateMaxLines>
              </Text>
            </CardLink>
          </li>
        ))}
      </CardsGridList>
    </div>
  )
}

/**
 * @TODO maybe - make this section "aware" (whether here or server-side) of all
 * the heading elements and auto-generate the heading levels? Goal is to make
 * sure anyone editing the content doesn't accidentally break the accessibilty
 * of this page.
 *  - Alternative idea: make a separate component for "nested" card-grid blocks
 */
const ProductRootDocsPathLandingMarketingContent = ({ blocks }) => {
  const currentProduct = useCurrentProduct()

  return (
    <div>
      {blocks.map((block) => {
        if (block.type === 'section-heading') {
          return (
            <SectionHeading
              headingLevel={block.headingLevel}
              text={block.title}
            />
          )
        }

        if (block.type === 'icon-card-grid') {
          return (
            <IconCardGrid
              cards={block.cards}
              productSlug={currentProduct.slug}
            />
          )
        }

        if (block.type === 'card-grid') {
          return (
            <CardGrid
              cards={block.cards}
              description={block.description}
              headingLevel={block.headingLevel}
              title={block.title}
            />
          )
        }
      })}
    </div>
  )
}

export default ProductRootDocsPathLandingMarketingContent
