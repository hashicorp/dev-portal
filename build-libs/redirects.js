//@ts-check

const fs = require('fs')
const path = require('path')
const proxySettings = require('./proxy-settings')
const {
	getProxiedProductSlug,
	isPreview,
	isDeployPreview,
} = require('../src/lib/env-checks')
const fetchGithubFile = require('./fetch-github-file')
const loadProxiedSiteRedirects = require('./load-proxied-site-redirects')
const { loadHashiConfigForEnvironment } = require('../config')

require('isomorphic-unfetch')

/** @typedef { import("next/dist/lib/load-custom-routes").Redirect } Redirect  */

const config = loadHashiConfigForEnvironment()

const PROXIED_PRODUCT = getProxiedProductSlug()

// copied from src/constants/hostname-map.ts so it's usable at build-time in the next config
const HOSTNAME_MAP = {
	'www.boundaryproject.io': 'boundary',
	'test-bd.hashi-mktg.com': 'boundary',

	'www.consul.io': 'consul',
	'test-cs.hashi-mktg.com': 'consul',

	'www.nomadproject.io': 'nomad',
	'test-nm.hashi-mktg.com': 'nomad',

	'www.packer.io': 'packer',
	'test-pk.hashi-mktg.com': 'packer',

	'docs.hashicorp.com': 'sentinel',
	'test-st.hashi-mktg.com': 'sentinel',

	'www.vagrantup.com': 'vagrant',
	'test-vg.hashi-mktg.com': 'vagrant',

	'www.vaultproject.io': 'vault',
	'test-vt.hashi-mktg.com': 'vault',

	'www.waypointproject.io': 'waypoint',
	'test-wp.hashi-mktg.com': 'waypoint',
}

// Redirect all proxied product pages
// to the appropriate product domain
//
// Note: we do this for ALL domains, as we never want visitors to
// see the original "proxied" routes, no matter what domain they're on.
const productsToProxy = Object.keys(proxySettings)
// In preview environments, it's actually nice to NOT have these redirects,
// as they prevent us from seeing the content we build for the preview URL
/** @type {Redirect[]} */
const devPortalToDotIoRedirects = isPreview()
	? []
	: productsToProxy.reduce((acc, slug) => {
			const routesToProxy = proxySettings[slug].routesToProxy
			// If we're trying to test this product's redirects in dev,
			// then we'll set the domain to an empty string for absolute URLs
			const domain = slug == PROXIED_PRODUCT ? '' : proxySettings[slug].domain
			const toDotIoRedirects = routesToProxy
				.filter(({ skipRedirect }) => !skipRedirect)
				.map(({ proxiedRoute, localRoute }) => {
					return {
						source: localRoute,
						destination: domain + proxiedRoute,
						permanent: false,
					}
				})
			return acc.concat(toDotIoRedirects)
	  }, [])

/**
 *
 * @param {Redirect[]} redirects
 * @param {string} productSlug
 * @param {string[]} betaSlugs
 * @returns {Redirect[]}
 */
function addHostCondition(redirects, productSlug, betaSlugs) {
	const host = proxySettings[productSlug].host
	return redirects.map((redirect) => {
		if (productSlug == PROXIED_PRODUCT) {
			return redirect
		}

		// If the productSlug is NOT a beta product, it is GA, so handle the redirect appropriately (exclude sentinel)
		if (!betaSlugs.includes(productSlug) && productSlug !== 'sentinel') {
			// The redirect should always apply in lower environments
			if (process.env.HASHI_ENV !== 'production') {
				return redirect
			}

			// for production, only apply the redirect for the developer domain
			return {
				...redirect,
				has: [
					{
						type: 'host',
						value: 'developer.hashicorp.com',
					},
				],
			}
		}

		// To enable previewing of .io sites, we accept an hc_dd_proxied_site cookie which must have a value matching a product slug
		if (isPreview()) {
			return {
				...redirect,
				has: [
					{
						type: 'cookie',
						key: 'hc_dd_proxied_site',
						value: host,
					},
				],
			}
		}

		return {
			...redirect,
			has: [
				{
					type: 'host',
					value: host,
				},
			],
		}
	})
}

/**
 * Fetch the latest ref from the content API to ensure the redirects are accurate.
 *
 * @TODO save the redirects to the content database and expose them directly via the API
 */
async function getLatestContentRefForProduct(product) {
	const contentUrl = new URL('https://content.hashicorp.com')
	contentUrl.pathname = `/api/content/${product}/version-metadata/latest`
	const latestRef = await fetch(contentUrl.toString())
		.then((resp) => resp.json())
		.then((json) => json.result.ref)

	return latestRef
}

/**
 * Fetches a redirects file for a given product from the given ref and evaluates the contents
 * as JS.
 */
async function getRedirectsForProduct(product, ref = 'stable-website') {
	const latestRef = await getLatestContentRefForProduct(product)

	const rawRedirects = isDeployPreview(product)
		? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
		: isDeployPreview()
		? '[]'
		: await fetchGithubFile({
				owner: 'hashicorp',
				repo: product,
				path: 'website/redirects.js',
				ref: latestRef ?? ref,
		  })
	const parsedRedirects = eval(rawRedirects) ?? []

	return addHostCondition(
		parsedRedirects,
		product,
		config['dev_dot.beta_product_slugs']
	)
}

async function buildProductRedirects() {
	// Fetch author-oriented redirects from product repos,
	// and merge those with dev-oriented redirects from
	// within this repository

	/**
	 * TODO
	 * Figure out solution to load Sentinel redirects from the Sentinel repo:
	 * https://app.asana.com/0/1202097197789424/1202532915796679/f
	 */
	const sentinelIoRedirects = [
		{
			source: '/',
			destination: '/sentinel',
			permanent: true,
		},
		{
			source: '/sentinel/commands/config',
			destination: '/sentinel/configuration',
			permanent: true,
		},
		// disallow '.html' or '/index.html' in favor of cleaner, simpler paths
		{ source: '/:path*/index', destination: '/:path*', permanent: true },
		{ source: '/:path*.html', destination: '/:path*', permanent: true },
	]

	const productRedirects = (
		await Promise.all([
			getRedirectsForProduct('boundary'),
			getRedirectsForProduct('nomad'),
			getRedirectsForProduct('vault'),
			getRedirectsForProduct('waypoint'),
			getRedirectsForProduct('vagrant'),
			getRedirectsForProduct('packer'),
			getRedirectsForProduct('consul'),
		])
	).flat()

	return [
		...devPortalToDotIoRedirects,
		...productRedirects,
		...addHostCondition(
			sentinelIoRedirects,
			'sentinel',
			config['dev_dot.beta_product_slugs']
		),
	]
}

/**
 * @TODO these redirects will eventually be defined in /proxied-redirects/
 * @returns {Promise<Redirect[]>}
 */
async function buildDevPortalRedirects() {
	return [
		{
			source: '/hashicorp-cloud-platform',
			destination: '/hcp',
			permanent: true,
		},
	]
}

/**
 * Splits an array of redirects into simple (one-to-one path matches without
 * regex matching) and glob-based (with regex matching). Enables processing
 * redirects via middleware instead of the built-in redirects handling.
 * @param {Redirect[]} redirects
 * @returns {{ simpleRedirects: Redirect[], globRedirects: Redirect[] }}
 */
function splitRedirectsByType(redirects) {
	/** @type {Redirect[]} */
	const simpleRedirects = []

	/** @type {Redirect[]} */
	const globRedirects = []

	redirects.forEach((redirect) => {
		if (
			['(', ')', '{', '}', ':', '*', '+', '?'].some((char) =>
				redirect.source.includes(char)
			) ||
			(redirect.has && redirect.has.some((has) => has.type !== 'host'))
		) {
			globRedirects.push(redirect)
		} else {
			simpleRedirects.push(redirect)
		}
	})

	return { simpleRedirects, globRedirects }
}

/**
 * Groups simple redirects into an object keyed by the product slug they apply
 * to (as determined by the `host` property).
 * @param {Redirect[]} redirects
 */
function groupSimpleRedirects(redirects) {
	/** @type {Record<string, string>} */
	const hostMatching = Object.entries(proxySettings).reduce(
		(acc, [productSlug, productProxySettings]) => {
			acc[productProxySettings.host] = productSlug
			return acc
		},
		{}
	)

	/** @type {Record<string, Record<string, { destination: string, permanent?: boolean }>>} */
	const groupedRedirects = {}
	redirects.forEach((redirect) => {
		if (redirect.has && redirect.has.length > 0) {
			let product
			if (redirect.has[0].type === 'host') {
				const hasHostValue = redirect.has[0].value

				// this handles the scenario where redirects are built through our proxy config and have the host value matching what is defined in build-libs/proxy-config.js
				product = hostMatching[hasHostValue] ?? HOSTNAME_MAP[hasHostValue]
			} else {
				// this handles the `hc_dd_proxied_site` cookie
				product = HOSTNAME_MAP[redirect.has[0].value]
			}

			if (product) {
				if (product in groupedRedirects) {
					groupedRedirects[product][redirect.source] = {
						destination: redirect.destination,
						permanent: redirect.permanent,
					}
				} else {
					groupedRedirects[product] = {
						[redirect.source]: {
							destination: redirect.destination,
							permanent: redirect.permanent,
						},
					}
				}
			}
		} else {
			if ('*' in groupedRedirects) {
				groupedRedirects['*'][redirect.source] = {
					destination: redirect.destination,
					permanent: redirect.permanent,
				}
			} else {
				groupedRedirects['*'] = {
					[redirect.source]: {
						destination: redirect.destination,
						permanent: redirect.permanent,
					},
				}
			}
		}
	})

	return groupedRedirects
}

async function redirectsConfig() {
	const productRedirects = await buildProductRedirects()
	const devPortalRedirects = await buildDevPortalRedirects()
	const proxiedSiteRedirects = await loadProxiedSiteRedirects()

	const { simpleRedirects, globRedirects } = splitRedirectsByType([
		...proxiedSiteRedirects,
		...productRedirects,
		...devPortalRedirects,
	])
	const groupedSimpleRedirects = groupSimpleRedirects(simpleRedirects)
	if (process.env.DEBUG_REDIRECTS) {
		console.log(
			'[DEBUG_REDIRECTS]',
			JSON.stringify({ simpleRedirects, groupedSimpleRedirects, globRedirects })
		)
	}
	return {
		simpleRedirects: groupedSimpleRedirects,
		globRedirects,
	}
}

module.exports = {
	redirectsConfig,
	splitRedirectsByType,
	groupSimpleRedirects,
	addHostCondition,
}
