/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

//@ts-check

/**
 * @typedef {Object} SiteProxyConfig
 * @property {string} domain
 * @property {string} host
 * @property {string[]} assets
 */

/**
 * @type {Record<string, SiteProxyConfig>}
 */
const proxyConfig = {
	consul: {
		domain: 'https://www.consul.io',
		host: '(www\\.consul\\.io|test-cs\\.hashi-mktg\\.com)',
		assets: ['/files/press-kit.zip'],
	},
	nomad: {
		domain: 'https://www.nomadproject.io',
		host: '(www\\.nomadproject\\.io|test-nm\\.hashi-mktg\\.com)',
		assets: [
			'/files/press-kit.zip',
			'/data/vault/nomad-server-policy.hcl',
			'/data/vault/nomad-cluster-role.json',
		],
	},
	sentinel: {
		// actually https://docs.hashicorp.com, but using test-st.hashi-mktg.com as a test
		domain: 'https://docs.hashicorp.com',
		host: '(docs\\.hashicorp\\.com|test-st\\.hashi-mktg\\.com)',
		assets: [],
	},
	// terraform: {
	//   domain: 'https://test-tf.hashi-mktg.com',
	//   host: 'test-tf.hashi-mktg.com',
	//   assets: [],
	// },
	vagrant: {
		domain: 'https://www.vagrantup.com',
		host: '(www\\.vagrantup\\.com|test-vg\\.hashi-mktg\\.com)',
		assets: ['/files/press-kit.zip'],
	},
	vault: {
		domain: 'https://www.vaultproject.io',
		host: '(www\\.vaultproject\\.io|test-vt\\.hashi-mktg\\.com)',
		assets: ['/files/press-kit.zip'],
	},
	waypoint: {
		domain: 'https://www.waypointproject.io',
		host: '(www\\.waypointproject\\.io|test-wp\\.hashi-mktg\\.com)',
		assets: ['/files/press-kit.zip'],
	},
}

module.exports = proxyConfig
