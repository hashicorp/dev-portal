import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import installData from 'data/waypoint-install.json'
import { Product } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import EmptyLayout from 'layouts/empty'
import ProductDownloadsView from 'views/product-downloads-view'
import PlaceholderDownloadsView from 'views/placeholder-product-downloads-view'

const WaypointDownloadsPage = (
  props: GeneratedProps & { pageContent: any }
): ReactElement => {
  if (__config.flags.enable_new_downloads_view) {
    const { latestVersion, pageContent, releases } = props
    return (
      <ProductDownloadsView
        pageContent={pageContent}
        latestVersion={latestVersion}
        releases={releases}
      />
    )
  } else {
    return <PlaceholderDownloadsView />
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const product = waypointData as Product
  const pageContent = installData

  return generateStaticProps(product, { pageContent })
}

WaypointDownloadsPage.layout = EmptyLayout

export default WaypointDownloadsPage
