import hcpData from 'data/hcp.json'
import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
import pageContent from './content.json'

const getStaticProps = generateGetStaticProps({
  includeMDXSource: true,
  pageContent,
  productSlugForLoader: 'cloud.hashicorp.com',
  product: hcpData as ProductData,
})

export { getStaticProps }
export default ProductRootDocsPathLanding
