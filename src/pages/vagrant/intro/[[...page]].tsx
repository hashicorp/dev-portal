import { ReactElement } from 'react'
import vagrantData from 'data/vagrant.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'intro'
const baseName = 'Intro'
const product = vagrantData as Product

const VagrantIntroPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

VagrantIntroPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default VagrantIntroPage
