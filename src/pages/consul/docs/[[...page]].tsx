import { ReactElement } from 'react'
import consulData from 'data/consul.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import ConfigEntryReference from 'components/author-primitives/consul/config-entry-reference'
import { consulUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'

const basePath = 'docs'
const baseName = 'Docs'
const product = consulData as Product
const additionalComponents = { ConfigEntryReference }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const ConsulDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} additionalComponents={additionalComponents} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  additionalRemarkPlugins: [consulUrlAdjuster],
})

ConsulDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default ConsulDocsPage
