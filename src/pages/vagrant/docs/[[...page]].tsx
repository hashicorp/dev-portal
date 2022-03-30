import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import DocsView from 'views/docs-view'
// imports below are used on server
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import { getLatestVersionFromVersions } from 'lib/fetch-release-data'
import { makeFetchWithRetry } from 'lib/fetch-with-retry'

const basePath = 'docs'
const baseName = 'Docs'
const product = vagrantData as ProductData

// Note that we require VMWARE_UTILITY_VERSION to be in { scope } for the MDX
// on the  /vagrant/docs/providers/vmware/vagrant-vmware-utility page.
// We fetch VMWARE_UTILITY_VERSION from the releases.hashicorp.com API.
type MdxScope = { VMWARE_UTILITY_VERSION: string }
const { getStaticPaths, getStaticProps } =
  getStaticGenerationFunctions<MdxScope>({
    product,
    basePath,
    baseName,
    getScope: async () => ({
      VMWARE_UTILITY_VERSION: await getLatestVagrantVmwareVersion(),
    }),
  })

/**
 * As noted in src/lib/fetch-release-data, we want to use fetch-with-retry
 * when pulling data from releases.hashicorp.com in order to avoid finicky
 * redeploys due to race conditions between the latest release showing up.
 */
const fetchWithRetry = makeFetchWithRetry(fetch, { retries: 3, delay: 1000 })

/**
 * Fetch the latest version of the Vagrant VMWare utility
 * from the releases.hashicorp.com API.
 *
 * @returns {string} A semver string representing the latest version number
 */
async function getLatestVagrantVmwareVersion(): Promise<string> {
  const url = 'https://releases.hashicorp.com/vagrant-vmware-utility/index.json'
  return await fetchWithRetry(url, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  })
    .then((res) => res.json())
    .then((result) => {
      return getLatestVersionFromVersions(Object.keys(result.versions))
    })
}

export { getStaticPaths, getStaticProps }
export default DocsView
