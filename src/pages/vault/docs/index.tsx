import vaultData from 'data/vault.json'
import pageContent from 'content/vault/docs-landing.json'
import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'

const getStaticProps = generateGetStaticProps({
	pageContent,
	product: vaultData as ProductData,
})

export { getStaticProps }
export default ProductRootDocsPathLanding
