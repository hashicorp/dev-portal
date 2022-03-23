import { ReactElement } from 'react'
import vagrantData from 'data/vagrant.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'

const basePath = 'vagrant-cloud'
const baseName = 'Vagrant Cloud'
const product = vagrantData as Product

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const VagrantCloudPage = ({ mdxSource }): ReactElement => {
  return <DocsView mdxSource={mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

VagrantCloudPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default VagrantCloudPage
