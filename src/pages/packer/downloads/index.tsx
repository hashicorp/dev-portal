import { GetStaticProps } from 'next'
import packerData from 'data/packer.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'

export const getStaticProps: GetStaticProps = async () => {
	return await generateStaticProps(packerData as ProductData)
}

export default ProductDownloadsView
