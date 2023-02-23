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
			`${siteUrl}/server-sitemap.xml`,
		],
	},
	exclude: [
		'/swingset*',
		'/onboarding/*',
		'/profile*',
		'sitemap.xml',
		'/server-sitemap.xml',
		'/boundary/docs*',
		'/consul/docs*',
		'/consul/commands*',
		'/consul/api-docs*',
		'/nomad/docs*',
		'/nomad/plugins*',
		'/nomad/intro*',
		'/nomad/tools*',
		'/packer/docs*',
		'/packer/guides*',
		'/packer/intro*',
		'/packer/plugins*',
		'/terraform/docs*',
		'/terraform/cli*',
		'/terraform/internals*',
		'/terraform/intro*',
		'/terraform/language*',
		'/vagrant/docs*',
		'/vagrant/intro*',
		'/vagrant/vagrant-cloud*',
		'/waypoint/docs*',
		'/waypoint/commands*',
		'/waypoint/plugins*',
		'/vault/docs*',
		'/vault/api-docs*',
	],
}
