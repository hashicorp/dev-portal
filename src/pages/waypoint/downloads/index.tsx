import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Card from 'components/card'
import Text from 'components/text'
import s from './downloads-page.module.css'
import DevDotTabs from 'components/dev-dot-tabs'

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae leo id nunc convallis euismod et vel erat. Fusce vel velit turpis. Vivamus fringilla consequat metus, vitae euismod sem eleifend in. Morbi in ullamcorper dui. Quisque rutrum auctor tristique. Vivamus ac turpis non arcu fringilla interdum. Aliquam feugiat lectus ipsum, eu tincidunt mi tristique id. Aliquam sodales eros semper pharetra molestie. Mauris porta, nunc in tempor eleifend, metus massa sagittis nisi, non maximus quam mauris a erat. Duis nec risus diam. Aenean auctor accumsan ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce et sagittis nunc. Cras vel eros id purus sollicitudin lobortis. Vivamus hendrerit volutpat nulla.'

const product = waypointData as Product

const WaypointDownloadsSidecarContent = () => {
  return (
    <Card elevation="base">
      <Text className={s.sidecarCardLabel} size={200} weight="semibold">
        Lorem ipsum
      </Text>
      <Text className={s.sidecarCardText} size={200}>
        This is a test to show that the Sidecar component can now render custom
        content by page.
      </Text>
    </Card>
  )
}

const WaypointDowloadsPage = (): ReactElement => {
  const backToLink = {
    text: 'Back to Waypoint',
    url: '/waypoint',
  }
  const navData = [
    ...product.sidebar.landingPageNavData,
    { divider: true },
    ...product.sidebar.resourcesNavData,
  ]

  // TODO: currently shows placeholder content for testing purposes
  return (
    <SidebarSidecarLayout
      backToLink={backToLink}
      navData={navData}
      productName="Waypoint"
      sidecarChildren={<WaypointDownloadsSidecarContent />}
    >
      <h1>DevDotTabs Test</h1>
      <DevDotTabs
        tabs={[
          {
            id: 'tab-1',
            label: 'Tab 1',
            content: <p>I am in Tab 1</p>,
          },
          {
            id: 'tab-2',
            label: 'Tab 2',
            content: <p>I am in Tab 2</p>,
          },
          {
            id: 'tab-3',
            label: 'Tab 3',
            content: <p>I am in Tab 3</p>,
          },
        ]}
      />
    </SidebarSidecarLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      product,
    },
    revalidate: 10,
  }
}

WaypointDowloadsPage.layout = EmptyLayout

export default WaypointDowloadsPage
