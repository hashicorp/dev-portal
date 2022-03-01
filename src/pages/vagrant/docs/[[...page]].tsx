import { ReactElement } from 'react'
import vagrantData from 'data/vagrant.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import Button from '@hashicorp/react-button'
import fetchContentApiFileString from 'lib/fetch-content-api-file-string'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'

const basePath = 'docs'
const baseName = 'Docs'
const product = vagrantData as Product
const additionalComponents = { Button }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const VagrantDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} additionalComponents={additionalComponents} />
}

const { getStaticPaths } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

// TODO: We need to pass VMWARE_UTILITY_VERSION as { scope } in order to render
// TODO: the "/vagrant/docs/providers/vmware/vagrant-vmware-utility" route.
// TODO: VMWARE_UTILITY_VERSION is kept up to date in the "version.json"
// TODO: file in the "hashicorp/packer" repository.
// TODO: Below is a temporary solution using getStaticGenerationFunctions as-is,
// TODO: calling it within getStaticProps AFTER first fetching vagrant's
// TODO: "version.json" file and pulling VMWARE_UTILITY_VERSION out of it.
async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<$TSFixMe>> {
  const versionData = JSON.parse(
    await fetchContentApiFileString({
      product: 'vagrant',
      filePath: 'website/data/version.json',
      version: 'refs/heads/stable-website',
    })
  )
  const { VMWARE_UTILITY_VERSION } = versionData
  const scope = { VMWARE_UTILITY_VERSION }
  const {
    getStaticProps: generatedGetStaticProps,
  } = getStaticGenerationFunctions({ product, basePath, baseName, scope })
  return await generatedGetStaticProps(context)
}

VagrantDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default VagrantDocsPage
