import { ReactElement } from 'react'
import vagrantData from 'data/vagrant.json'
import { Product } from 'types/products'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import Button from '@hashicorp/react-button'
// imports below are used on server
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import fetchFileString from 'lib/fetch-file-string'
import { getLatestVersionFromVersions } from 'lib/fetch-release-data'

const basePath = 'docs'
const baseName = 'Docs'
const product = vagrantData as Product
const additionalComponents = { Button }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const VagrantDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} additionalComponents={additionalComponents} />
}

// Note that we require VMWARE_UTILITY_VERSION to be in { scope } for the MDX
// on the  /vagrant/docs/providers/vmware/vagrant-vmware-utility page.
// We fetch VMWARE_UTILITY_VERSION from the releases.hashicorp.com API.
const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  getScope: async () => ({
    VMWARE_UTILITY_VERSION: await getLatestVagrantVmwareVersion(),
  }),
})

/**
 * Fetch the latest version of the Vagrant VMWare utility
 * from the releases.hashicorp.com API.
 *
 * @returns {string} A semver string representing the latest version number
 */
async function getLatestVagrantVmwareVersion(): Promise<string> {
  const url = 'https://releases.hashicorp.com/vagrant-vmware-utility/index.json'
  const releaseData = JSON.parse(await fetchFileString(url))
  return getLatestVersionFromVersions(Object.keys(releaseData.versions))
}

VagrantDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default VagrantDocsPage
