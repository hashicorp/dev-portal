import { ReactElement } from 'react'
import consulData from 'data/consul.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import { consulUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'

const basePath = 'commands'
const baseName = 'CLI'
const product = consulData as Product

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const ConsulCommandsPage = ({ mdxSource }): ReactElement => {
  return <DocsView mdxSource={mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  additionalRemarkPlugins: [consulUrlAdjuster],
})

ConsulCommandsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default ConsulCommandsPage
