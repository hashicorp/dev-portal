import vaultData from 'data/vault.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'

const getStaticProps = generateGetStaticProps(vaultData as ProductData, {
	isEnterpriseMode: true,
})

export { getStaticProps }
export default ProductDownloadsView
