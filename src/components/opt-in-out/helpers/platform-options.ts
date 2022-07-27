import { PlatformOptionRedirectData, RedirectData } from '../types'
import { getLearnRedirectPath } from './get-learn-redirect-path'
import { generateGetIoRedirectPath } from './get-io-redirect-path'
import { ProductSlug } from 'types/products'

/**
 * Map of productSlug to the product's dot-io domain.
 *
 * Note: somewhat duplicative of "proxyConfig" in "build-libs",
 * but... HCP and Sentinel and Terraform are not yet served
 * from here in dev-portal, so don't have proxy settings.
 */
const PRODUCT_IO_DOMAINS: Record<ProductSlug, string> = {
	boundary: 'https://www.boundaryproject.io',
	consul: 'https://www.consul.io',
	hcp: 'https://cloud.hashicorp.com',
	nomad: 'https://www.nomadproject.io',
	packer: 'https://www.packer.io',
	sentinel: 'https://docs.hashicorp.com',
	terraform: 'https://www.terraform.io',
	vault: 'https://www.vaultproject.io',
	vagrant: 'https://www.vagrantup.com',
	waypoint: 'https://www.waypointproject.io',
}

/**
 * Given a productSlug,
 * Return RedirectData for use with opt-in-out redirection work.
 */
function getDotIoRedirectData(productSlug: ProductSlug): RedirectData {
	const domain = PRODUCT_IO_DOMAINS[productSlug]
	return {
		base_url: domain,
		getRedirectPath: generateGetIoRedirectPath(domain),
		cookieKey: `${productSlug}-io-beta-opt-in`,
		cookieAnalyticsKey: `${productSlug}-io-beta-opt-in-tracked`,
	}
}

export const PLATFORM_OPTIONS: PlatformOptionRedirectData = {
	learn: {
		base_url: 'https://learn.hashicorp.com',
		getRedirectPath: getLearnRedirectPath,
		cookieKey: 'learn-beta-opt-in',
		cookieAnalyticsKey: 'learn-beta-opt-in-tracked',
	},
	'boundary-io': getDotIoRedirectData('boundary'),
	'consul-io': getDotIoRedirectData('consul'),
	'hcp-io': getDotIoRedirectData('hcp'),
	'nomad-io': getDotIoRedirectData('nomad'),
	'packer-io': getDotIoRedirectData('packer'),
	'sentinel-io': getDotIoRedirectData('sentinel'),
	'terraform-io': getDotIoRedirectData('terraform'),
	'vault-io': getDotIoRedirectData('vault'),
	'vagrant-io': getDotIoRedirectData('vagrant'),
	'waypoint-io': getDotIoRedirectData('waypoint'),
}
