/**
 * Fixes up Packer plugin links that use a redirected format
 * in the "old" URL format, before plugins were moved to `/plugin`.
 *
 * Note: previously, on packer.io, we used redirects to make this correction.
 * See `proxied-redirects/www.packer.io.redirects.js` at the root of this
 * repository for those redirects. These redirects still apply to packer.io,
 * but do not work for developer.hashicorp.com.
 */
export function fixupRedirectedPackerPlugins(url: string): string {
	// Run through find-and-replaces that represent former redirects
	const matchedFindReplace = PACKER_PLUGIN_REDIRECTS.find(({ find }) => {
		console.log({ url, find })
		return find.test(url)
	})
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
const PACKER_PLUGIN_REDIRECTS: { find: RegExp; replace: string }[] = [
	{
		find: /^\/docs\/post-processors\/amazon-(.*)/,
		replace: '/docs/post-processors/amazon/-$1',
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

/*

{
		source: '/docs/builders/amazon-:path',
		destination: '/docs/builders/amazon/:path*',
		permanent: true,
	},
	{
		source: '/docs/builders/azure-:path',
		destination: '/docs/builders/azure/:path*',
		permanent: true,
	},
	{
		source: '/docs/builders/hyperv-:path',
		destination: '/docs/builders/hyperv/:path*',
		permanent: true,
	},
	{
		source: '/docs/builders/oracle-:path',
		destination: '/docs/builders/oracle/:path*',
		permanent: true,
	},
	{
		source: '/docs/builders/osc-:path',
		destination: '/docs/builders/outscale/:path*',
		permanent: true,
	},
	{
		source: '/docs/builders/parallels-:path',
		destination: '/docs/builders/parallels/:path*',
		permanent: true,
	},
	{
		source: '/docs/builders/virtualbox-:path',
		destination: '/docs/builders/virtualbox/:path*',
		permanent: true,
	},
	{
		source: '/docs/builders/vmware-:path',
		destination: '/docs/builders/vmware/:path*',
		permanent: true,
	},
	{
		source: '/docs/builders/vsphere-:path',
		destination: '/docs/builders/vmware/vsphere-:path*',
		permanent: true,
	},
	{
		source: '/docs/post-processors/docker-:path',
		destination: '/docs/post-processors/docker/docker-:path*',
		permanent: true,
	},
	
	*/
