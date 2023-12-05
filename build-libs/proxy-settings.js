/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

//@ts-check

// const fs = require('fs')
// const path = require('path')
// const klawSync = require('klaw-sync')
// const proxyConfig = require('./proxy-config')

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
	// sentinel: {
	// 	domain: proxyConfig.sentinel.domain,
	// 	host: proxyConfig.sentinel.host,
	// 	routesToProxy: [
	// 		...gatherRoutesToProxy('/_proxied-dot-io/sentinel'),
	// 		...buildAssetRoutesToProxy(
	// 			proxyConfig.sentinel.assets,
	// 			'/sentinel-public'
	// 		),
	// 		...getDevPortalRoutesToProxy('sentinel'),
	// 	],
	// },
}
module.exports = proxySettings
