//@ts-check

const fs = require('fs')
const path = require('path')
const klawSync = require('klaw-sync')
const proxyConfig = require('./proxy-config')

/**
 * @typedef {Object} SiteProxySettings
 * @property {string} domain
 * @property {string} host
 * @property {{ proxiedRoute: string, localRoute: string, skipRedirect?: boolean }[]} routesToProxy
 */

/**
 * @type {Record<string, SiteProxySettings>}
 */
const proxySettings = {
	boundary: {
		domain: proxyConfig.boundary.domain,
		host: proxyConfig.boundary.host,
		routesToProxy: [
			...gatherRoutesToProxy('/_proxied-dot-io/boundary'),
			...buildAssetRoutesToProxy(
				proxyConfig.boundary.assets,
				'/boundary-public'
			),
			...getDevPortalRoutesToProxy('boundary'),
		],
	},
	nomad: {
		domain: proxyConfig.nomad.domain,
		host: proxyConfig.nomad.host,
		routesToProxy: [
			...gatherRoutesToProxy('/_proxied-dot-io/nomad'),
			...buildAssetRoutesToProxy(proxyConfig.nomad.assets, '/nomad-public'),
			...getDevPortalRoutesToProxy('nomad'),
		],
	},
	packer: {
		domain: proxyConfig.packer.domain,
		host: proxyConfig.packer.host,
		routesToProxy: [
			...gatherRoutesToProxy('/_proxied-dot-io/packer'),
			...buildAssetRoutesToProxy(proxyConfig.packer.assets, '/packer'),
			...getDevPortalRoutesToProxy('packer'),
		],
	},
	sentinel: {
		domain: proxyConfig.sentinel.domain,
		host: proxyConfig.sentinel.host,
		routesToProxy: [
			...gatherRoutesToProxy('/_proxied-dot-io/sentinel'),
			...buildAssetRoutesToProxy(
				proxyConfig.sentinel.assets,
				'/sentinel-public'
			),
			...getDevPortalRoutesToProxy('sentinel'),
		],
	},
	vagrant: {
		domain: proxyConfig.vagrant.domain,
		host: proxyConfig.vagrant.host,
		routesToProxy: [
			...gatherRoutesToProxy('/_proxied-dot-io/vagrant'),
			...buildAssetRoutesToProxy(proxyConfig.vagrant.assets, '/vagrant-public'),
			...getDevPortalRoutesToProxy('vagrant'),
		],
	},
	vault: {
		domain: proxyConfig.vault.domain,
		host: proxyConfig.vault.host,
		routesToProxy: [
			...gatherRoutesToProxy('/_proxied-dot-io/vault'),
			...buildAssetRoutesToProxy(proxyConfig.vault.assets, '/vault-public'),
			...getDevPortalRoutesToProxy('vault'),
		],
	},
	waypoint: {
		domain: proxyConfig.waypoint.domain,
		host: proxyConfig.waypoint.host,
		routesToProxy: [
			...gatherRoutesToProxy('/_proxied-dot-io/waypoint'),
			...buildAssetRoutesToProxy(
				proxyConfig.waypoint.assets,
				'/waypoint-public'
			),
			...getDevPortalRoutesToProxy('waypoint'),
		],
	},
	consul: {
		domain: proxyConfig.consul.domain,
		host: proxyConfig.consul.host,
		routesToProxy: [
			...gatherRoutesToProxy('/_proxied-dot-io/consul'),
			...buildAssetRoutesToProxy(proxyConfig.consul.assets, '/consul-public'),
			...getDevPortalRoutesToProxy('consul'),
		],
	},
}
module.exports = proxySettings

/**
 * Rewrites known dev-portal routes to the proxied product routes, even if they don't exist.
 * This ensures that we aren't inadvertently exposing dev-portal routes through our .io sites
 *
 * @param {string} product
 * @returns {{ proxiedRoute: string, localRoute: string, skipRedirect: boolean }[]}
 */
function getDevPortalRoutesToProxy(product) {
	return fs
		.readdirSync(path.join(process.cwd(), 'src', 'pages'), {
			withFileTypes: true,
		})
		.filter((ent) => ent.isDirectory() && ent.name !== '_proxied-dot-io')
		.map(({ name }) => ({
			proxiedRoute: `/:path(${name}(?:\\/.*)?)`,
			localRoute: `/_proxied-dot-io/${product}/:path`,
			skipRedirect: true,
		}))
}

/**
 *
 * @param {string[]} assetPaths
 * @param {string} localAssetsDir
 * @returns {{ proxiedRoute: string, localRoute: string }[]}
 */
function buildAssetRoutesToProxy(assetPaths, localAssetsDir) {
	return assetPaths.map((proxiedRoute) => ({
		proxiedRoute: proxiedRoute,
		localRoute: `${localAssetsDir}${proxiedRoute}`,
	}))
}

/**
 * Given a directory of pages to proxy,
 * returns an array of { proxiedRoute, localRoute } objects,
 * which can be used to construct the necessary
 * redirects and rewrites.
 *
 * @param {string} pagesDir
 * @returns {{ proxiedRoute: string, localRoute: string }[]}
 */
function gatherRoutesToProxy(pagesDir) {
	const targetDir = path.resolve(`./src/pages${pagesDir}`)
	if (!fs.existsSync(targetDir)) {
		return []
	}
	const pageExtensions = ['tsx', 'ts', 'jsx', 'js']
	const pageFilePaths = klawSync(targetDir)
	const routesToProxy = pageFilePaths
		.filter((file) => {
			const extension = path.extname(file.path).slice(1)
			const isPage = pageExtensions.indexOf(extension) != -1
			return isPage
		})
		.map((file) => {
			const extension = path.extname(file.path)
			const basename = path.basename(file.path, extension)
			const isDynamic = basename.slice(0, 1) == '['
			const parentDirRoute = path.relative(targetDir, path.dirname(file.path))
			const urlPath =
				basename === 'index' || isDynamic
					? parentDirRoute
					: path.join(parentDirRoute, basename)
			const proxiedRoute = `/${urlPath}${isDynamic ? '/:path*' : ''}`
			const localRoute = `${pagesDir}${proxiedRoute == '/' ? '' : proxiedRoute}`
			return {
				proxiedRoute,
				localRoute,
			}
		})
		.sort((aObj, bObj) => {
			const a = aObj.proxiedRoute
			const b = bObj.proxiedRoute
			return a < b ? -1 : a > b ? 1 : 0
		})
	return routesToProxy
}
