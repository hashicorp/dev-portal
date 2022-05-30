import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import installData from 'data/waypoint-install.json'
import { ProductData } from 'types/products'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'
import {
  ProductDownloadsViewStaticProps,
  RawProductDownloadsViewContent,
} from 'views/product-downloads-view/types'

const WaypointDownloadsPage = ({
  latestVersion,
  pageContent,
  releases,
}: ProductDownloadsViewStaticProps): ReactElement => {
  return (
    <ProductDownloadsView
      latestVersion={latestVersion}
      pageContent={pageContent}
      releases={releases}
    />
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return await generateStaticProps(
    waypointData as ProductData,
    installData as unknown as RawProductDownloadsViewContent
  )
}

WaypointDownloadsPage.layout = CoreDevDotLayout

export default WaypointDownloadsPage
