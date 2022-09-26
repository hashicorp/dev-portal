import { PlatformOptionRedirectData, RedirectData } from '../types'
import { getLearnRedirectPath } from './get-learn-redirect-path'
import { generateGetIoRedirectPath } from './get-io-redirect-path'
import { ProductSlug } from 'types/products'
import { productSlugsToHostNames } from 'lib/products'

/**
 * Given a productSlug,
 * Return RedirectData for use with opt-in-out redirection work.
 */
function getDotIoRedirectData(productSlug: ProductSlug): RedirectData {
	let domain = `https://www.${productSlugsToHostNames[productSlug]}`

	// We don't alias www for cloud.hashicorp.com
	if (productSlug === 'hcp') {
		domain = `https://${productSlugsToHostNames[productSlug]}`
	}
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
