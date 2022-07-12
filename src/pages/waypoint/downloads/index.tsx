import { GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import installData from 'data/waypoint-install.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'
import { RawProductDownloadsViewContent } from 'views/product-downloads-view/types'

export const getStaticProps: GetStaticProps = async () => {
  return await generateStaticProps(
    waypointData as ProductData,
    installData as RawProductDownloadsViewContent
  )
}

export default ProductDownloadsView
