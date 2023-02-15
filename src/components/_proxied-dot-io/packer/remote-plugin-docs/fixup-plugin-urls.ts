/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Fixes up Packer plugin links that use an "old" URL format.
 *
 * For context, Packer plugins used to be served from "old" URLs like:
 * https://www.packer.io/docs/:type/<pluginName>
 * where `:type` is one of:
 * "builders", "datasources", "post-processor", "provisioners"
 * and `<pluginName>` is the name of the plugin repository.
 *
 * Before the move to Dev Dot, we separated external plugin docs
 * out from within `/docs` and gave them a dedicated "new" `/plugins` URL:
 * https://www.packer.io/plugins/:type/<pluginName>
 * So, in addition to the link correct that happens for Dev Dot
 * (which will happen *after* this function runs), for Packer plugins MDX,
 * we need to detect "old" plugin URLs and transform them to the "new" format.
 *
 * This function handles this "old" to "new" conversion.
 *
 * Note: previously, on packer.io, we used redirects to make this correction.
 * See `proxied-redirects/www.packer.io.redirects.js` at the root of this
 * repository for those redirects. These redirects still apply to packer.io,
 * but do not work for developer.hashicorp.com.
 */
export function fixupPackerPluginUrls(url: string): string {
	// We want to match /docs/:type/:pluginSlug URLs.
	const typesPart = `(${PACKER_PLUGIN_TYPES.join('|')})`
	const slugPart = `(${PACKER_PLUGIN_SLUGS.join('|')})`
	const pluginUrlRegex = new RegExp(`^\\/docs\\/${typesPart}\\/${slugPart}`)
	const isMatch = pluginUrlRegex.test(url)
	if (isMatch) {
		// If we have a match, replace /docs at the start with /plugins.
		return url.replace(/^\/docs/, '/plugins')
	} else {
		// If we don't have a match, no URLs should be harmed.
		return url
	}
}

/**
 * A snapshot of the types of plugins from when Packer plugins
 * were served from the "old" URLS, nested under `/docs`.
 */
const PACKER_PLUGIN_TYPES = [
	'builders',
	'datasources',
	'post-processors',
	'provisioners',
]

/**
 * A snapshot of the plugin URLs from when Packer plugins
 * were served from the "old" URLS, nested under `/docs`.
 */
const PACKER_PLUGIN_SLUGS = [
	'alicloud',
	'amazon',
	'anka',
	'ansible',
	'azure',
	'chef',
	'cloudstack',
	'converge',
	'digitalocean',
	'docker',
	'git',
	'googlecompute',
	'hashicups',
	'hetzner-cloud',
	'huaweicloud',
	'hyperone',
	'hyperv',
	'inspec',
	'jdcloud',
	'kamatera',
	'linode',
	'lxc',
	'lxd',
	'ncloud',
	'oneandone',
	'openstack',
	'oracle',
	'outscale',
	'parallels',
	'profitbricks',
	'proxmox',
	'puppet',
	'qemu',
	'salt',
	'scaleway',
	'sshkey',
	'tencentcloud',
	'triton',
	'ucloud',
	'vagrant',
	'virtualbox',
	'vmware',
	'vsphere',
	'vultr',
	'yandex',
]
