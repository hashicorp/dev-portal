/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const { loadEnvConfig } = require('@next/env')

// Load environment variables, as they are not normally available in the next.config.js file. (https://nextjs.org/docs/app/guides/environment-variables#loading-environment-variables-with-nextenv)
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const fs = require('fs')
const path = require('path')
const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const { redirectsConfig } = require('./build-libs/redirects')

const HashiConfigPlugin = require('./config/plugin')
const { loadHashiConfigForEnvironment } = require('./config/index')

/**
 * @type {import('next/dist/lib/load-custom-routes').Header}
 *
 * Adds a `noindex` directive to all pages on `tip.waypointproject.io`.
 * We don't want content on that domain to be indexed.
 */
const hideWaypointTipContent = {
	source: '/:path*',
	headers: [
		{
			key: 'X-Robots-Tag',
			value: 'noindex,nofollow',
		},
	],
	has: [
		{
			type: 'host',
			value: 'tip.waypointproject.io',
		},
	],
}

let loggedUDR = false;

module.exports = async () => {
	const appConfig = await loadHashiConfigForEnvironment()

	if (!loggedUDR) {
		loggedUDR = true
		console.log(`Loading UDR from ${process.env.UNIFIED_DOCS_API}`);
		console.log(`Loading UDR Products: ${JSON.stringify(
			appConfig["flags.unified_docs_migrated_repos"],
			null,
			2)}`
		);
	}

	return withHashicorp({
		css: false,
	})({
		transpilePackages: [
			'@hashicorp/flight-icons',
			/**
		 * TODO: once Sentinel has been migrated into the dev-portal repository,
		 * we should consider localizing the sentinel-embedded component. Should
		 * first confirm with Cam Stitt that this component is not being used
		 * elsewhere.
		 */
			'@hashicorp/sentinel-embedded',
			'unist-util-is',
			'unist-util-visit',
			'unist-util-visit-parents',
		],
		webpack(config) {
			config.plugins.push(HashiConfigPlugin(appConfig))

			if (
				typeof process.env.DD_API_KEY !== 'undefined' &&
				process.env.VERCEL_ENV &&
				process.env.VERCEL_ENV !== 'development'
			) {
				config.devtool = 'hidden-source-map'
			}

			return config
		},
		async headers() {
			return [hideWaypointTipContent]
		},
		async redirects() {
			const { simpleRedirects, complexRedirects } = await redirectsConfig()
			await fs.promises.writeFile(
				path.join('src', 'data', '_redirects.generated.json'),
				JSON.stringify(simpleRedirects, null, 2),
				'utf-8'
			)
			return complexRedirects
		},
		env: {
			ASSET_API_ENDPOINT: process.env.ASSET_API_ENDPOINT,
			AXE_ENABLED: process.env.AXE_ENABLED || 'false',
			DEV_IO: process.env.DEV_IO,
			PREVIEW_FROM_REPO: process.env.PREVIEW_FROM_REPO,
			ENABLE_VERSIONED_DOCS: process.env.ENABLE_VERSIONED_DOCS || 'false',
			HASHI_ENV: process.env.HASHI_ENV || 'development',
			IS_CONTENT_PREVIEW: process.env.IS_CONTENT_PREVIEW,
			MKTG_CONTENT_DOCS_API: process.env.MKTG_CONTENT_DOCS_API,
			// TODO: determine if DevDot needs this or not
			SEGMENT_WRITE_KEY: process.env.SEGMENT_WRITE_KEY,
			POSTHOG_PROJECT_API_KEY:
				process.env.VERCEL_ENV !== 'production'
					? process.env.POSTHOG_PROJECT_API_KEY_DEV
					: process.env.POSTHOG_PROJECT_API_KEY_PROD,
		},
		images: {
			formats: ['image/avif', 'image/webp'],
			domains: [
				'www.datocms-assets.com',
				'mktg-content-api-hashicorp.vercel.app',
				'content.hashicorp.com',
				// remove the http protocol from the URL
				process.env.UNIFIED_DOCS_API.replace(/^https?:\/\//, ''),
				// only allow localhost in development mode
				...(process.env.NODE_ENV === 'development' &&
					process.env.HASHI_ENV !== 'preview'
					? ['localhost']
					: []),
			],
			dangerouslyAllowSVG: true,
			contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		},
		experimental: {
			largePageDataBytes: 512 * 1000, // 512KB
			instrumentationHook: true,
		},
	})
}
