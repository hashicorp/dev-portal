// Third-party imports
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

// HashiCorp imports
import { IconBox16 } from '@hashicorp/flight-icons/svg-react/box-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'

// Global imports
import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import IconTileLogo from 'components/icon-tile-logo'
import Heading from 'components/heading'
import Text from 'components/text'
import CardLink from 'components/card-link'
import ProductDocsSearch from 'views/docs-view/components/product-docs-search'
import DocsView from 'views/docs-view'
import CardsGridList from 'components/cards-grid-list'
import TruncateMaxLines from 'components/truncate-max-lines'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'

// Local imports
import pageContent from './content.json'
import s from './style.module.css'

// Constants
const basePath = 'docs'
const baseName = 'Docs'
const product = waypointData as ProductData
const iconMap = {
  box: <IconBox16 />,
  'terminal-screen': <IconTerminalScreen16 />,
}
const heroCards = [
  {
    iconName: 'terminal-screen',
    link: '/waypoint/commands',
    text: 'CLI',
  },
  {
    iconName: 'box',
    link: '/waypoint/plugins',
    text: 'Plugins',
  },
]

interface WaypointDocsLandingProps {
  mdxSource: MDXRemoteSerializeResult
}

// TODO: abstract the markup to a new view, such as RootDocsPathLandingView
const WaypointDocsLanding = ({ mdxSource }: WaypointDocsLandingProps) => {
  const { pageSubtitle } = pageContent

  return (
    <>
      {__config.flags.enable_product_docs_search ? <ProductDocsSearch /> : null}
      <div className={s.pageHeroWrapper}>
        <div className={s.pageHeroText}>
          <IconTileLogo productSlug="waypoint" />
          <div>
            <Heading className={s.pageTitle} level={1} size={500} weight="bold">
              Waypoint Documentation
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
      <div className={s.waypointMDXWrapper}>
        <DocsView mdxSource={mdxSource} hideSearch />
      </div>
      <div>
        {pageContent.marketingContentBlocks.map((block) => {
          if (block.type === 'card-grid') {
            // TODO move to a separate component
            return (
              <section>
                <Heading
                  className={devDotStyles.h2}
                  level={2}
                  size={400}
                  weight="bold"
                >
                  {block.title}
                </Heading>
                {/* TODO add support for description text */}
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
              </section>
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

WaypointDocsLanding.layout = SidebarSidecarLayout

/**
 * Wrapper for `generatedGetStaticProps`. Handles passing the correct `params`
 * property to `generatedGetStaticProps`.
 *
 * Also handles clearing the following `layoutProps` returned in the `props`
 * returned by `generatedGetStaticProps`: `githubFileUrl` and `sidecarSlot`.
 */
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

export default WaypointDocsLanding
