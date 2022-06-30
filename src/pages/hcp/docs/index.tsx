import hcpData from 'data/hcp.json'
import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
import pageContent from './content.json'

/**
 * TODO: cloud.hashicorp.com/docs redirects to cloud.hashicorp.com/docs/hcp,
 * and the content for the former URL is empty (just a heading).
 * This is a workaround to prevent the empty content from being rendered.
 * https://github.com/hashicorp/cloud.hashicorp.com/blob/main/content/docs/index.mdx
 *
 * Related redirects-in-dev-dot issues:
 * - Load redirects from private repos:
 *   https://app.asana.com/0/1202097197789424/1202532915796679/f
 * - Get remotely sourced redirects working for dev-dot routes:
 *   https://app.asana.com/0/1201987349274776/1201662082096106/f
 */

const getStaticProps = generateGetStaticProps({
  includeMDXSource: false,
  pageContent,
  productSlugForLoader: 'cloud.hashicorp.com',
  product: hcpData as ProductData,
})

export { getStaticProps }
export default ProductRootDocsPathLanding
