import { GetStaticProps } from 'next'
import boundaryData from 'data/boundary.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'

export const getStaticProps: GetStaticProps = async () => {
	return await generateStaticProps(boundaryData as ProductData)
}

export default ProductDownloadsView
