import { ReactElement } from 'react'
import consulData from 'data/consul.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import { consulUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'

const basePath = 'api-docs'
const baseName = 'API'
const product = consulData as Product

const ConsulApiDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  additionalRemarkPlugins: [consulUrlAdjuster],
})

ConsulApiDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default ConsulApiDocsPage
