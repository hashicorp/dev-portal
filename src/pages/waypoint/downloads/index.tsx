import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import EmptyLayout from 'layouts/empty'
import ProductDownloadsView from 'views/product-downloads-view'
import PlaceholderDownloadsView from 'views/placeholder-product-downloads-view'

const WaypointDownloadsPage = (props: GeneratedProps): ReactElement => {
  if (__config.flags.enable_new_downloads_view) {
    const { latestVersion, releases } = props
    return (
      <ProductDownloadsView latestVersion={latestVersion} releases={releases} />
    )
  } else {
    return <PlaceholderDownloadsView />
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const product = waypointData as Product

  return generateStaticProps(product)
}

WaypointDownloadsPage.layout = EmptyLayout

export default WaypointDownloadsPage
