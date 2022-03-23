import { ReactElement } from 'react'
import vaultData from 'data/vault.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import { vaultUrlAdjuster } from 'layouts/sidebar-sidecar/utils/product-url-adjusters'

const basePath = 'api-docs'
const baseName = 'API'
const product = vaultData as Product

const VaultApiDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  additionalRemarkPlugins: [vaultUrlAdjuster],
})

VaultApiDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default VaultApiDocsPage
