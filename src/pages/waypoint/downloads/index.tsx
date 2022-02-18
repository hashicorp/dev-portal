import { GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'lib/fetch-release-data'

export const getStaticProps: GetStaticProps = async () => {
  const product = waypointData as Product

  return generateStaticProps(product)
}

export default ProductDownloadsView
