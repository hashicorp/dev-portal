/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.SITE_URL || 'https://developer.hashicorp.com'

module.exports = {
	siteUrl,
	generateRobotsTxt: true,
	robotsTxtOptions: {
		additionalSitemaps: [
			`${siteUrl}/hcp-sitemap.xml`,
			`${siteUrl}/sitemap-docs.xml`,
		],
	},
	exclude: [
		'/swingset*',
		'/onboarding/*',
		'/profile*',
		'sitemap.xml',
		'/boundary*',
		'/consul*',
		'/nomad*',
		'/packer*',
		'/terraform*',
		'/vagrant*',
		'/waypoint*',
		'/vault*',
	],
	// ...other options
}
