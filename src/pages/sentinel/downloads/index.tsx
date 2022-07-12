import { GetStaticProps } from 'next'
import sentinelData from 'data/sentinel.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'

export const getStaticProps: GetStaticProps = async () => {
	return await generateStaticProps(sentinelData as ProductData)
}

export default ProductDownloadsView
