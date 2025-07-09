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
			// sitemap generated from ./pages/server-sitemap.xml/index.tsx
			`${siteUrl}/server-sitemap.xml`,
		],
		policies: [
			{ userAgent: 'GPTBot', disallow: '/validated-designs' },
			{ userAgent: '*', allow: '/' }, // default policy
		],
	},
	/*
	 * Exhaustive exclude list to remove duplicate sitemap paths.
	 * This list will not exist once all phases of the Sitemap Improvements project is complete
	 * Sitemap Improvements Asana https://app.asana.com/0/1203590180322427/overview
	 */
	exclude: [
		'/onboarding/*',
		'/profile*',
		'sitemap.xml',
		'/server-sitemap.xml',
		'/boundary/docs*',
		'/boundary/tutorials*',
		'/consul/docs*',
		'/consul/commands*',
		'/consul/api-docs*',
		'/consul/tutorials*',
		'/nomad/docs*',
		'/nomad/plugins*',
		'/nomad/tools*',
		'/nomad/tutorials*',
		'/packer/docs*',
		'/packer/guides*',
		'/packer/intro*',
		'/packer/plugins*',
		'/packer/tutorials*',
		'/terraform/docs*',
		'/terraform/cli*',
		'/terraform/internals*',
		'/terraform/intro*',
		'/terraform/language*',
		'/terraform/tutorials*',
		'/vagrant/docs*',
		'/vagrant/intro*',
		'/vagrant/vagrant-cloud*',
		'/vagrant/tutorials*',
		'/waypoint/docs*',
		'/waypoint/commands*',
		'/waypoint/plugins*',
		'/waypoint/tutorials*',
		'/vault/docs*',
		'/vault/api-docs*',
		'/vault/tutorials*',
		'/well-architected-framework/*',
		'/hcp/tutorials*',
		'/hcp/docs',
	],
}
