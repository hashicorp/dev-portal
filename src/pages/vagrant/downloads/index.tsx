import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'

const getStaticProps = generateGetStaticProps(vagrantData as ProductData)

export { getStaticProps }
export default ProductDownloadsView
