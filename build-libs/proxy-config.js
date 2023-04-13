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
}

module.exports = proxyConfig
