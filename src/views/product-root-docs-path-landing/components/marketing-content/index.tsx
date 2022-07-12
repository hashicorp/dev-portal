import classNames from 'classnames'
import { useCurrentProduct } from 'contexts'
import Heading, { HeadingProps } from 'components/heading'
import Text from 'components/text'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import TruncateMaxLines from 'components/truncate-max-lines'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'
import { SUPPORTED_ICONS } from '../supported-icons'
import s from './marketing-content.module.css'

/**
 * @TODO move to a different folder/file & document
 * @TODO make Heading have default size instead of this abstraction?
 */
const AutosizedHeading = ({
  className,
  id,
  level,
  text,
}: {
  className?: string
  id: string
  level: 2 | 3
  text: string
}) => {
  const levelsToSize = {
    2: 400,
    3: 300,
  }
  const classes = classNames(
    devDotStyles[`h${level}`],
    s.heading,
    s[`h${level}`],
    className
  )

  return (
    <Heading
      className={classes}
      id={id}
      level={level}
      size={levelsToSize[level] as HeadingProps['size']}
      weight="bold"
    >
      {text}
    </Heading>
  )
}

/**
 * @TODO move to a different folder/file & document
 */
const SectionHeading = ({ level, id, text }) => {
  return (
    <AutosizedHeading
      className={s.sectionHeading}
      id={id}
      level={level}
      text={text}
    />
  )
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
const CardGrid = ({ cards, description, title, headingId, headingLevel }) => {
  const hasTitle = Boolean(title)
  const hasDescription = Boolean(description)

  return (
    <div className={s.cardGridWrapper}>
      {hasTitle && (
        <AutosizedHeading level={headingLevel} id={headingId} text={title} />
      )}
      {hasDescription && (
        <Text className={s.cardGridDescription} size={300} weight="regular">
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

const ProductRootDocsPathLandingMarketingContent = ({ blocks }) => {
  const currentProduct = useCurrentProduct()

  return (
    <div className={s.root}>
      {blocks.map((block) => {
        if (block.type === 'section-heading') {
          return (
            <SectionHeading
              id={block.headingId}
              level={block.headingLevel}
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
              headingId={block.headingId}
              title={block.title}
            />
          )
        }
      })}
    </div>
  )
}

export default ProductRootDocsPathLandingMarketingContent
