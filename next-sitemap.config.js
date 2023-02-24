/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || 'https://developer.hashicorp.com',
	generateRobotsTxt: true, // (optional)
	exclude: ['/swingset*', '/onboarding/*', '/profile*'],
	// ...other options
}
