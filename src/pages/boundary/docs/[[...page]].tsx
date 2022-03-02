import { ReactElement } from 'react'
import boundaryData from 'data/boundary.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'docs'
const baseName = 'Docs'
const product = boundaryData as Product

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const ConsulDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

ConsulDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default ConsulDocsPage
