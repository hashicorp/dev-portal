import { ReactElement } from 'react'
import nomadData from 'data/nomad.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'intro'
const baseName = 'Intro'
const product = nomadData as Product

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const NomadIntroDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

NomadIntroDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default NomadIntroDocsPage
