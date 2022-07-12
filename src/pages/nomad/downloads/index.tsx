import { GetStaticProps } from 'next'
import nomadData from 'data/nomad.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'

export const getStaticProps: GetStaticProps = async () => {
	return await generateStaticProps(nomadData as ProductData)
}

export default ProductDownloadsView
