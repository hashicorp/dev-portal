import { GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'

export const getStaticProps: GetStaticProps = async () => {
	return await generateStaticProps(waypointData as ProductData)
}

export default ProductDownloadsView
