/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

type FindReplace = {
	find: RegExp
	replace: string
}

/**
 * Fixes up Packer plugin links that use a redirected format
 * in the "old" URL format, before plugins were moved to `/plugins`.
 *
 * Note: previously, on packer.io, we used redirects to make this correction.
 * See `proxied-redirects/www.packer.io.redirects.js` at the root of this
 * repository for those redirects. These redirects still apply to packer.io,
 * but do not work for developer.hashicorp.com.
 */
export function fixupRedirectedPackerPlugins(url: string): string {
	// Run through find-and-replaces that represent former redirects
	const matchedFindReplace = PACKER_PLUGIN_REDIRECTS.find(
		({ find }: FindReplace) => {
			return find.test(url)
		}
	)
	// If there is a matched find and replace, run it
	if (matchedFindReplace) {
		const { find, replace } = matchedFindReplace
		const result = url.replace(find, replace)
		return result
	} else {
		return url
	}
}

/**
 * A snapshot of the plugin redirects from when Packer plugins
 * were served from the "old" URLS, nested under `/docs`.
 */
const PACKER_PLUGIN_REDIRECTS: FindReplace[] = [
	{
		find: /^\/docs\/builders\/amazon-(.*)/,
		replace: '/docs/builders/amazon/$1',
	},
	{
		find: /^\/docs\/builders\/azure-(.*)/,
		replace: '/docs/builders/azure/$1',
	},
	{
		find: /^\/docs\/builders\/hyperv-(.*)/,
		replace: '/docs/builders/hyperv/$1',
	},
	{
		find: /^\/docs\/builders\/oracle-(.*)/,
		replace: '/docs/builders/oracle/$1',
	},
	{
		find: /^\/docs\/builders\/osc-(.*)/,
		replace: '/docs/builders/outscale/$1',
	},
	{
		find: /^\/docs\/builders\/parallels-(.*)/,
		replace: '/docs/builders/parallels/$1',
	},
	{
		find: /^\/docs\/builders\/virtualbox-(.*)/,
		replace: '/docs/builders/virtualbox/$1',
	},
	{
		find: /^\/docs\/builders\/vmware-(.*)/,
		replace: '/docs/builders/vmware/$1',
	},
	{
		find: /^\/docs\/builders\/vsphere-(.*)/,
		replace: '/docs/builders/vmware/vsphere-$1',
	},
	{
		find: /^\/docs\/post-processors\/docker-(.*)/,
		replace: '/docs/post-processors/docker/docker-$1',
	},
]
