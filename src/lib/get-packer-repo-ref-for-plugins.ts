import { cachedGetProductData } from 'lib/get-product-data'
import { RootDocsPath } from 'types/products'
import { getBetaLatestVersionRef } from 'views/docs-view/server'

/**
 * Resolves the `hashicorp/packer` branch
 * from which `plugins-manifest.json`, `plugins-nav-data.json`,
 * and Packer `/plugins` root path content will be loaded.
 */
export function getPackerRepoRefForPlugins() {
	const fromBetaLatestVersionRef = getBetaLatestVersionRef('packer')
	const fromProductData = cachedGetProductData('packer').rootDocsPaths.find(
		({ path }: RootDocsPath) => {
			return path == 'plugins'
		}
	).mainBranch
	return fromBetaLatestVersionRef || fromProductData || 'main'
}
