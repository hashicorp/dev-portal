import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import installData from 'data/waypoint-install.json'
import { ProductData } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductDownloadsView from 'views/product-downloads-view'

const WaypointDownloadsPage = (props: GeneratedProps): ReactElement => {
  const { latestVersion, releases } = props
  return (
    <ProductDownloadsView
      latestVersion={latestVersion}
      pageContent={installData}
      releases={releases}
    />
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const product = waypointData as ProductData

  return generateStaticProps(product)
}

WaypointDownloadsPage.layout = CoreDevDotLayout

export default WaypointDownloadsPage
