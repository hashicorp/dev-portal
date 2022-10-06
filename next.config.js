const fs = require('fs')
const path = require('path')
const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const withSwingset = require('swingset')
const { redirectsConfig } = require('./build-libs/redirects')
const rewritesConfig = require('./build-libs/rewrites')
const HashiConfigPlugin = require('./config/plugin')
const { loadHashiConfigForEnvironment } = require('./config')

// Set api key for Happy Kit feature flags
const happyKitKey = process.env.NEXT_PUBLIC_FLAGS_ENV_KEY
	? process.env.NEXT_PUBLIC_FLAGS_ENV_KEY
	: 'flags_pub_development_343442393171755603'

const config = loadHashiConfigForEnvironment()

/**
 * @type {import('next/dist/lib/load-custom-routes').Header}
 *
 * Temporary. Adds a `noindex` directive to all pages for products that are still in beta, and sentinel.
 *
 * e.g. If terraform and consul are the only products in the beta array, only developer.hashicorp.com/(consul|terraform)/* will get noindex
 */
const temporary_hideDocsPaths = {
	source: `/(${[...config['dev_dot.beta_product_slugs'], 'sentinel'].join(
		'|'
	)})/:path*`,
	headers: [
		{
			key: 'X-Robots-Tag',
			value: 'noindex',
		},
	],
	has: [
		{
			type: 'host',
			value: 'developer.hashicorp.com',
		},
	],
}

module.exports = withSwingset({
	componentsRoot: 'src/components/**/*',
	docsRoot: 'src/swingset-docs/*',
})(
	withHashicorp({
		nextOptimizedImages: true,
		css: false,
		transpileModules: [
			'@hashicorp/flight-icons',
			/**
			 * TODO: once Sentinel has been migrated into the dev-portal repository,
			 * we should consider localizing the sentinel-embedded component. Should
			 * first confirm with Cam Stitt that this component is not being used
			 * elsewhere.
			 */
			'@hashicorp/sentinel-embedded',
			'swingset',
			'unist-util-visit',
		],
	})({
		webpack(config) {
			config.plugins.push(HashiConfigPlugin())
			return config
		},
		async headers() {
			return [temporary_hideDocsPaths]
		},
		async redirects() {
			const { simpleRedirects, globRedirects } = await redirectsConfig()
			await fs.promises.writeFile(
				path.join('src', 'data', '_redirects.generated.json'),
				JSON.stringify(simpleRedirects, null, 2),
				'utf-8'
			)
			return globRedirects
		},
		async rewrites() {
			const rewrites = await rewritesConfig()

			if (process.env.DEBUG_REWRITES) {
				await fs.promises.writeFile(
					path.join('src', 'data', '_rewrites.generated.json'),
					JSON.stringify(rewrites, null, 2),
					'utf-8'
				)
			}

			return rewrites
		},
		env: {
			AXE_ENABLED: process.env.AXE_ENABLED || false,
			BUGSNAG_CLIENT_KEY: '06718db5e1d75829801baa0b4ca2fb7b',
			BUGSNAG_SERVER_KEY: 'b32b4487b5dc72b32f51c8fe33641a43',
			DEV_IO: process.env.DEV_IO,
			PREVIEW_FROM_REPO: process.env.PREVIEW_FROM_REPO,
			ENABLE_VERSIONED_DOCS: process.env.ENABLE_VERSIONED_DOCS || false,
			HASHI_ENV: process.env.HASHI_ENV || 'development',
			IS_CONTENT_PREVIEW: process.env.IS_CONTENT_PREVIEW,
			// TODO: determine if DevDot needs this or not
			SEGMENT_WRITE_KEY: process.env.SEGMENT_WRITE_KEY,
			HAPPY_KIT_KEY: happyKitKey,
		},
		svgo: {
			plugins: [
				{
					removeViewBox: false,
					collapseGroups: false,
				},
			],
		},
		images: {
			formats: ['image/avif', 'image/webp'],
			domains: [
				'www.datocms-assets.com',
				'mktg-content-api-hashicorp.vercel.app',
				'content.hashicorp.com',
			],
			dangerouslyAllowSVG: true,
			contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		},
		experimental: {
			largePageDataBytes: 512 * 1000, // 512KB
		},
	})
)
