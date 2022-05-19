// Global imports
import vaultData from 'data/vault.json'
import { ProductData } from 'types/products'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import { IconTools16 } from '@hashicorp/flight-icons/svg-react/tools-16'
import ProductDocsSearch from 'views/docs-view/components/product-docs-search'
import IconTileLogo from 'components/icon-tile-logo'
import Heading from 'components/heading'
import Text from 'components/text'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import TruncateMaxLines from 'components/truncate-max-lines'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'

// Local imports
import pageContent from './content.json'
import s from './style.module.css'

// Constants
const basePath = 'docs'
const baseName = 'Docs'
const product = vaultData as ProductData
const iconMap = {
  tools: <IconTools16 />,
}
const heroCards = [
  {
    iconName: 'tools',
    link: '/vault/api-docs',
    text: 'API',
  },
]

const VaultDocsLanding = () => {
  const { marketingContentBlocks, pageSubtitle } = pageContent

  return (
    <>
      {__config.flags.enable_product_docs_search ? <ProductDocsSearch /> : null}
      <div className={s.pageHeroWrapper}>
        <div className={s.pageHeroText}>
          <IconTileLogo productSlug="vault" />
          <div>
            <Heading className={s.pageTitle} level={1} size={500} weight="bold">
              Vault Documentation
            </Heading>
            <Text className={s.pageSubtitle}>{pageSubtitle}</Text>
          </div>
        </div>
        <ul className={s.heroCardList}>
          {heroCards.map(({ iconName, link, text }) => (
            <li key={link}>
              <CardLink className={s.heroCardLink} href={link}>
                {iconMap[iconName]}
                <Text
                  asElement="span"
                  className={s.heroCardLinkText}
                  size={200}
                  weight="semibold"
                >
                  {text}
                </Text>
              </CardLink>
            </li>
          ))}
        </ul>
      </div>
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

const { getStaticProps: generatedGetStaticProps } =
  getStaticGenerationFunctions({
    product,
    basePath,
    baseName,
  })

export async function getStaticProps({ context }) {
  // TODO: remove the any
  const generatedProps = (await generatedGetStaticProps({
    ...context,
    params: { page: [] },
  })) as any

  generatedProps.props.layoutProps.githubFileUrl = null

  // TODO handle rendering the sidecar in a follow-up PR
  generatedProps.props.layoutProps.sidecarSlot = null

  return generatedProps
}

VaultDocsLanding.layout = SidebarSidecarLayout
export default VaultDocsLanding
