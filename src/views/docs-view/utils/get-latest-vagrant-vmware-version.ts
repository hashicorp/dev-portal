import { getLatestVersionFromVersions } from 'lib/fetch-release-data'
import { makeFetchWithRetry } from 'lib/fetch-with-retry'

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
export async function getLatestVagrantVmwareVersion(): Promise<string> {
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
