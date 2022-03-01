import { ReactElement } from 'react'
import vagrantData from 'data/vagrant.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import Button from '@hashicorp/react-button'

const basePath = 'docs'
const baseName = 'Docs'
const product = vagrantData as Product
const additionalComponents = { Button }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const VagrantDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} additionalComponents={additionalComponents} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

VagrantDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default VagrantDocsPage
