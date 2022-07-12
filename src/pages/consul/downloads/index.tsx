import { GetStaticProps } from 'next'
import consulData from 'data/consul.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'

export const getStaticProps: GetStaticProps = async () => {
	return await generateStaticProps(consulData as ProductData)
}

export default ProductDownloadsView
