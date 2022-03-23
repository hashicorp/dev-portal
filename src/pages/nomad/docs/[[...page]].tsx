import { ReactElement } from 'react'
import nomadData from 'data/nomad.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import Placement from 'components/author-primitives/shared/placement-table'

const basePath = 'docs'
const baseName = 'Docs'
const product = nomadData as Product
const additionalComponents = { Placement }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const NomadDocsPage = ({ mdxSource }): ReactElement => {
  return (
    <DocsView
      mdxSource={mdxSource}
      additionalComponents={additionalComponents}
    />
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

NomadDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default NomadDocsPage
