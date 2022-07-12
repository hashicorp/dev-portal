import vaultData from 'data/vault.json'
import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
import pageContent from './content.json'

const getStaticProps = generateGetStaticProps({
  pageContent,
  product: vaultData as ProductData,
})

export { getStaticProps }
export default ProductRootDocsPathLanding
