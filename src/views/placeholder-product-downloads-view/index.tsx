import { ReactElement } from 'react'
import { useCurrentProduct } from 'contexts'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Card from 'components/card'
import Text from 'components/text'
import s from './placeholder-product-downloads-view.module.css'

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae leo id nunc convallis euismod et vel erat. Fusce vel velit turpis. Vivamus fringilla consequat metus, vitae euismod sem eleifend in. Morbi in ullamcorper dui. Quisque rutrum auctor tristique. Vivamus ac turpis non arcu fringilla interdum. Aliquam feugiat lectus ipsum, eu tincidunt mi tristique id. Aliquam sodales eros semper pharetra molestie. Mauris porta, nunc in tempor eleifend, metus massa sagittis nisi, non maximus quam mauris a erat. Duis nec risus diam. Aenean auctor accumsan ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce et sagittis nunc. Cras vel eros id purus sollicitudin lobortis. Vivamus hendrerit volutpat nulla.'
const LOREM_IPSUM_SHORT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae leo id nunc convallis euismod et vel erat.'

const PlaceholderSidecarContent = () => {
  return (
    <>
      <Card elevation="base">
        <Text className={s.sidecarCardLabel} size={200} weight="semibold">
          Lorem ipsum
        </Text>
        <Text className={s.sidecarCardText} size={200}>
          {LOREM_IPSUM_SHORT}
        </Text>
      </Card>
    </>
  )
}

const PlaceholderDownloadsView = (): ReactElement => {
  const currentProduct = useCurrentProduct()
  const navData = [
    ...currentProduct.sidebar.landingPageNavData,
    { divider: true },
    ...currentProduct.sidebar.resourcesNavData,
  ]

  return (
    <SidebarSidecarLayout
      navData={navData}
      productName={currentProduct.name}
      sidecarChildren={<PlaceholderSidecarContent />}
    >
      <h1>Install {currentProduct.name}</h1>
      <p>{LOREM_IPSUM}</p>
    </SidebarSidecarLayout>
  )
}

export default PlaceholderDownloadsView
