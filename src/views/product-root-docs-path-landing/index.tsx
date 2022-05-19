/**
 * @TODO organize imports
 */
import ProductDocsSearch from 'views/docs-view/components/product-docs-search'
import IconTileLogo from 'components/icon-tile-logo'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './product-root-docs-path-landing.module.css'
import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import { IconBox16 } from '@hashicorp/flight-icons/svg-react/box-16'
import IconCardLink from 'components/icon-card-link'
import { IconTools16 } from '@hashicorp/flight-icons/svg-react/tools-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { ProductData } from 'types/products'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import TruncateMaxLines from 'components/truncate-max-lines'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'
import { ReactElement } from 'react'

const SUPPORTED_ICONS = {
  box: <IconBox16 />,
  tools: <IconTools16 />,
  'terminal-screen': <IconTerminalScreen16 />,
}

interface ProductRootDocsPathLandingProps {
  mdxSlot?: ReactElement
  pageContent: {
    pageSubtitle: string
    // TODO create a block type
    marketingContentBlocks: any[]
  }
}

/**
 * @TODO move to helpers file / create PageHeading component local to this view
 * @TODO write description
 */
const generatePageHeading = (
  currentProduct: ProductData,
  currentPath: string
) => {
  const currentRootDocsPath = currentProduct.rootDocsPaths.find(
    ({ path }) => `/${currentProduct.slug}/${path}` === currentPath
  )
  return `${currentProduct.name} ${currentRootDocsPath.shortName}`
}

const ProductRootDocsPathLanding = ({
  mdxSlot,
  pageContent,
}: ProductRootDocsPathLandingProps) => {
  const currentProduct = useCurrentProduct()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const { pageSubtitle, marketingContentBlocks } = pageContent

  const showProductDocsSearch = __config.flags.enable_product_docs_search

  return (
    <>
      {showProductDocsSearch && <ProductDocsSearch />}
      <div className={s.pageHeroWrapper}>
        <div className={s.pageHeroText}>
          <IconTileLogo productSlug="vault" />
          <div>
            <Heading className={s.pageTitle} level={1} size={500} weight="bold">
              {generatePageHeading(currentProduct, currentPath)}
            </Heading>
            <Text className={s.pageSubtitle}>{pageSubtitle}</Text>
          </div>
        </div>
        <ul className={s.heroCardList}>
          {currentProduct.rootDocsPaths.map(({ iconName, path, name }) => {
            const fullPath = `/${currentProduct.slug}/${path}`
            const matchesCurrentPath = fullPath === currentPath

            if (matchesCurrentPath) {
              return null
            }

            return (
              <li key={path}>
                <IconCardLink
                  icon={SUPPORTED_ICONS[iconName]}
                  productSlug={currentProduct.slug}
                  text={name}
                  url={path}
                />
              </li>
            )
          })}
        </ul>
      </div>
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
