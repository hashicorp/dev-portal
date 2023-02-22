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
		'/boundary/docs*',
		'/boundary/commands*',
		'/consul/docs*',
		'/consul/commands*',
		'/nomad/docs*',
		'/nomad/commands*',
		'/packer/docs*',
		'/packer/commands*',
		'/terraform/docs*',
		'/terraform/commands*',
		'/vagrant/docs*',
		'/vagrant/commands*',
		'/waypoint/docs*',
		'/waypoint/commands*',
		'/vault/docs*',
		'/vault/commands*',
	],
}
