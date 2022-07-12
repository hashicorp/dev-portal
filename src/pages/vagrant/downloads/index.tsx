import { GetStaticProps } from 'next'
import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'

export const getStaticProps: GetStaticProps = async () => {
	return await generateStaticProps(vagrantData as ProductData)
}

export default ProductDownloadsView
