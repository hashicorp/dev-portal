/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
const { getTutorialRedirects } = require('./tutorial-redirects')
const {
	integrationMultipleComponentRedirects,
} = require('./integration-multiple-component-redirects')
const { packerPluginRedirects } = require('./integration-packer-redirects')

require('isomorphic-unfetch')

/** @typedef { import("next/dist/lib/load-custom-routes").Redirect } Redirect  */

const PROXIED_PRODUCT = getProxiedProductSlug()

// copied from src/constants/hostname-map.ts so it's usable at build-time in the next config
const HOSTNAME_MAP = {
	'docs.hashicorp.com': 'sentinel',
	'test-st.hashi-mktg.com': 'sentinel',
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
 * @returns {Redirect[]}
 */
function addHostCondition(redirects, productSlug) {
	const host = proxySettings[productSlug]?.host
	return redirects.map((redirect) => {
		if (productSlug == PROXIED_PRODUCT) {
			return redirect
		}

		// If the productSlug is NOT a beta product, it is GA, so handle the redirect appropriately (exclude sentinel)
		if (productSlug !== 'sentinel') {
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
async function getRedirectsForProduct(
	/** @type {string} The product slug. Corresponds to a repository name. */
	product,
	{ ref = 'stable-website', redirectsPath = 'website/redirects.js' } = {}
) {
	let latestRef = ref
	try {
		latestRef = await getLatestContentRefForProduct(product)
	} catch (error) {
		// do nothing
		console.warn(
			'[redirects] failed to fetch latestRef for:',
			product,
			error.message
		)
	}

	let repo = product

	/** @type {string} A raw redirects file string to evaluate */
	let rawRedirects

	/**
	 * Load the raw redirects
	 */
	if (isDeployPreview(product)) {
		// For deploy previews of this product, load redirects locally,
		// as authors may be modifying redirects as part of their work.
		rawRedirects = fs.readFileSync(
			path.join(process.cwd(), '../redirects.js'),
			'utf-8'
		)
	} else if (isDeployPreview()) {
		// For deploy previews in "other products", return an empty array,
		// since we'll be removing the content for this product anyways.
		rawRedirects = '[]'
	} else {
		// Otherwise, such as for production deploys,
		// load redirects from the product repository.
		rawRedirects = await fetchGithubFile({
			owner: 'hashicorp',
			repo,
			path: redirectsPath,
			ref: latestRef ?? ref,
		})
	}

	/** @type {Redirect[]} */
	const parsedRedirects = eval(rawRedirects) ?? []

	// Filter invalid redirects, such as those without a `/{productSlug}` prefix.
	const validRedirects = filterInvalidRedirects(parsedRedirects, product)

	return addHostCondition(validRedirects, product)
}

async function buildProductRedirects() {
	// Fetch author-oriented redirects from product repos,
	// and merge those with dev-oriented redirects from
	// within this repository
	if (process.env.SKIP_BUILD_PRODUCT_REDIRECTS) {
		return []
	}

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
			getRedirectsForProduct('terraform-docs-common', {
				ref: 'main',
			}),
		])
	).flat()

	try {
		productRedirects.push(
			...(await getRedirectsForProduct('hcp-docs', {
				ref: 'main',
				redirectsPath: '/redirects.js',
			}))
		)
	} catch (err) {
		console.warn(
			'[redirects] failed to fetch redirects for hcp-docs. Falling back to cloud.hashicorp.com',
			err.message
		)
		productRedirects.push(
			...(await getRedirectsForProduct('cloud.hashicorp.com', {
				ref: 'main',
				redirectsPath: '/redirects.js',
			}))
		)
	}

	return [
		...devPortalToDotIoRedirects,
		...productRedirects,
		...addHostCondition(sentinelIoRedirects, 'sentinel'),
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
		/**
		 * Redirect Waypoint Plugins to Waypoint Integrations
		 *
		 * Note: canonical list of plugin pages that require redirects can be
		 * derived from the plugins nav-data.json file:
		 * https://github.com/hashicorp/waypoint/blob/main/website/data/plugins-nav-data.json
		 */
		{
			source: '/waypoint/plugins',
			destination: '/waypoint/integrations',
			permanent: true,
		},
		{
			source: '/waypoint/plugins/:slug',
			destination: '/waypoint/integrations/hashicorp/:slug',
			permanent: true,
		},
		/**
		 * Redirect for Integration Component rework.
		 * Further details in the file this is imported from.
		 */
		...integrationMultipleComponentRedirects,
		/**
		 * Redirects from our former Packer Plugin library to our
		 * new integrations library for Packer,
		 */
		...packerPluginRedirects,
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
 * Filters out invalid redirects authored in product repositories.
 *
 * In order to be valid, a redirect must:
 * - Have a `source` prefixed with the product slug, like `/{productSlug}/...`,
 *   as we're applying these redirects to `developer.hashicorp.com`.
 * - (perhaps other criteria to be determined later).
 *
 * Invalid redirects will be filtered out and ignored.
 *
 * @param {Redirect[]} redirects
 * @param {string} repoSlug
 * @returns {Redirect[]}
 */
function filterInvalidRedirects(redirects, repoSlug) {
	/**
	 * Normalize the repoSlug into a productSlug.
	 */
	const productSlugsByRepo = {
		/** @deprecated - terraform-website is now archived and redirects have been moved to `terraform-docs-common` */
		'terraform-website': 'terraform',
		'terraform-docs-common': 'terraform',
		'cloud.hashicorp.com': 'hcp',
		'hcp-docs': 'hcp',
	}
	const productSlug = productSlugsByRepo[repoSlug] ?? repoSlug

	/** @type {Redirect[]} */
	const invalidRedirects = []

	/**
	 * Filter out any redirects not prefixed with the `product` slug.
	 */
	const validRedirects = redirects.filter((entry) => {
		// Redirects must be prefixed with the product slug.
		const isPrefixed = entry.source.startsWith(`/${productSlug}`)
		// Keep track of non-prefixed redirects, we want to warn about these
		if (!isPrefixed) {
			invalidRedirects.push(entry)
		}
		return isPrefixed
	})

	/**
	 * Log a warning for any invalid authored redirects.
	 *
	 * Note: this warning will be output during the preview build process,
	 * in Vercel's logs, so may not be immediately visible to authors.
	 */
	if (invalidRedirects.length > 0) {
		let message = `Found invalid redirects. Invalid redirects are ignored.`
		message += ` Please ensure all redirects start with "/${productSlug}".`
		message += ` The following redirects must be updated to start with "/${productSlug}":`
		message += `\n${JSON.stringify(invalidRedirects, null, 2)}`
		console.warn(message)
	}

	// Return the filtered, valid redirects
	return validRedirects
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
		let product
		if (redirect.has && redirect.has.length > 0) {
			if (redirect.has[0].type === 'host') {
				const hasHostValue = redirect.has[0].value

				// this handles the scenario where redirects are built through our proxy config and have the host value matching what is defined in build-libs/proxy-config.js
				product = hostMatching[hasHostValue] ?? HOSTNAME_MAP[hasHostValue]
			} else {
				// this handles the `hc_dd_proxied_site` cookie
				product = HOSTNAME_MAP[redirect.has[0].value]
			}
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
	const tutorialRedirects = await getTutorialRedirects()

	const { simpleRedirects, globRedirects } = splitRedirectsByType([
		...proxiedSiteRedirects,
		...productRedirects,
		...devPortalRedirects,
		...tutorialRedirects,
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
	filterInvalidRedirects,
}
