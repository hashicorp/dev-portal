/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'https://developer.hashicorp.com',
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{ userAgent: 'GPTBot', disallow: '/validated-designs' },
			{ userAgent: '*', allow: '/' }, // default policy
		],
	},
	exclude: ['/profile*', 'sitemap.xml', '/validated-designs'],
}
