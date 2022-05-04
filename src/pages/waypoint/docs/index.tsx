import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import IconTileLogo from 'components/icon-tile-logo'
import Heading from 'components/heading'
import Text from 'components/text'
import CardLink from 'components/card-link'
import pageContent from './content.json'
import s from './style.module.css'
import { IconBox16 } from '@hashicorp/flight-icons/svg-react/box-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'

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

const WaypointDocsLanding = () => {
  const { pageSubtitle } = pageContent

  return (
    <>
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
      <div>TODO - MDX content</div>
      <div>TODO - marketing slot</div>
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

export async function getStaticProps({ context }) {
  // TODO: remove the any
  const generatedProps = (await generatedGetStaticProps({
    ...context,
    params: { page: [] },
  })) as any

  generatedProps.props.layoutProps.githubFileUrl = null
  generatedProps.props.layoutProps.sidecarSlot = null

  return generatedProps
}

export default WaypointDocsLanding
