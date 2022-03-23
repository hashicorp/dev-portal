import { ReactElement } from 'react'
import nomadData from 'data/nomad.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'plugins'
const baseName = 'Plugins'
const product = nomadData as Product

const NomadPluginsDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

NomadPluginsDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default NomadPluginsDocsPage
