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
const { isContentDeployPreview } = require('../src/lib/env-checks')
const buildBetaProductOptInRedirects = require('./build-beta-opt-in-redirect')

/** @typedef { import("next/dist/lib/load-custom-routes").Redirect } Redirect  */

const PROXIED_PRODUCT = getProxiedProductSlug()

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
	const host = proxySettings[productSlug].host
	return redirects.map((redirect) => {
		if (productSlug == PROXIED_PRODUCT) {
			return redirect
		}
		// To enable previewing of .io sites, we accept an io_preview cookie which must have a value matching a product slug
		if (isPreview()) {
			return {
				...redirect,
				has: [
					{
						type: 'cookie',
						key: 'io_preview',
						value: productSlug,
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

async function buildDotIoRedirects() {
	// Fetch author-oriented redirects from product repos,
	// and merge those with dev-oriented redirects from
	// within this repository

	// ... for Boundary
	const rawBoundaryRedirects = isContentDeployPreview('boundary')
		? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
		: isDeployPreview()
		? '[]'
		: await fetchGithubFile({
				owner: 'hashicorp',
				repo: 'boundary',
				path: 'website/redirects.js',
				ref: 'stable-website',
		  })
	const boundaryAuthorRedirects = eval(rawBoundaryRedirects)
	// TODO: split non-author redirects into dev-portal,
	// TODO: rather than leaving all redirects in the Boundary repo
	// TODO: intent is to do this after all products have been migrated
	const boundaryIoRedirects = [...boundaryAuthorRedirects]
	// ... for Nomad
	const rawNomadRedirects = isContentDeployPreview('nomad')
		? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
		: isDeployPreview()
		? '[]'
		: await fetchGithubFile({
				owner: 'hashicorp',
				repo: 'nomad',
				path: 'website/redirects.js',
				ref: 'stable-website',
		  })
	const nomadAuthorRedirects = eval(rawNomadRedirects)
	// TODO: split non-author redirects into dev-portal,
	// TODO: rather than leaving all redirects in the nomad repo
	// TODO: intent is to do this after all products have been migrated
	const nomadIoRedirects = [...nomadAuthorRedirects]
	// ... for Waypoint
	const rawWaypointRedirects = isContentDeployPreview('waypoint')
		? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
		: isDeployPreview()
		? '[]'
		: await fetchGithubFile({
				owner: 'hashicorp',
				repo: 'waypoint',
				path: 'website/redirects.js',
				ref: 'stable-website',
		  })
	const waypointAuthorRedirects = eval(rawWaypointRedirects)
	// TODO: split non-author redirects into dev-portal,
	// TODO: rather than leaving all redirects in the Waypoint repo
	// TODO: intent is to do this after all products have been migrated
	const waypointIoRedirects = [...waypointAuthorRedirects]
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

	const rawVaultRedirects = isContentDeployPreview('vault')
		? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
		: isDeployPreview()
		? '[]'
		: await fetchGithubFile({
				owner: 'hashicorp',
				repo: 'vault',
				path: 'website/redirects.js',
				ref: 'stable-website',
		  })
	const vaultAuthorRedirects = eval(rawVaultRedirects)
	// TODO: split non-author redirects into dev-portal,
	// TODO: rather than leaving all redirects in the Waypoint repo
	// TODO: intent is to do this after all products have been migrated
	const vaultIoRedirects = [...vaultAuthorRedirects]

	const rawVagrantRedirects = isContentDeployPreview('vagrant')
		? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
		: isDeployPreview()
		? '[]'
		: await fetchGithubFile({
				owner: 'hashicorp',
				repo: 'vagrant',
				path: 'website/redirects.js',
				ref: 'stable-website',
		  })
	const vagrantAuthorRedirects = eval(rawVagrantRedirects)
	// TODO: split non-author redirects into dev-portal,
	// TODO: rather than leaving all redirects in the Vagrant repo
	// TODO: intent is to do this after all products have been migrated
	const vagrantIoRedirects = [...vagrantAuthorRedirects]

	const rawPackerRedirects = isContentDeployPreview('packer')
		? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
		: isDeployPreview()
		? '[]'
		: await fetchGithubFile({
				owner: 'hashicorp',
				repo: 'packer',
				path: 'website/redirects.js',
				ref: 'stable-website',
		  })
	const packerAuthorRedirects = eval(rawPackerRedirects)
	// TODO: split non-author redirects into dev-portal,
	// TODO: rather than leaving all redirects in the Packer repo
	// TODO: intent is to do this after all products have been migrated
	const packerIoRedirects = [...packerAuthorRedirects]

	const rawConsulRedirects = isContentDeployPreview('consul')
		? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
		: isDeployPreview()
		? '[]'
		: await fetchGithubFile({
				owner: 'hashicorp',
				repo: 'consul',
				path: 'website/redirects.js',
				ref: 'stable-website',
		  })
	const consulAuthorRedirects = eval(rawConsulRedirects)
	// TODO: split non-author redirects into dev-portal,
	// TODO: rather than leaving all redirects in the Packer repo
	// TODO: intent is to do this after all products have been migrated
	const consulIoRedirects = [...consulAuthorRedirects]
	// TODO ... consolidate redirects for other products
	return [
		...devPortalToDotIoRedirects,
		...addHostCondition(boundaryIoRedirects, 'boundary'),
		...addHostCondition(nomadIoRedirects, 'nomad'),
		...addHostCondition(sentinelIoRedirects, 'sentinel'),
		...addHostCondition(vaultIoRedirects, 'vault'),
		...addHostCondition(waypointIoRedirects, 'waypoint'),
		...addHostCondition(vagrantIoRedirects, 'vagrant'),
		...addHostCondition(packerIoRedirects, 'packer'),
		...addHostCondition(consulIoRedirects, 'consul'),
	]
}

/**
 *
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
			const product =
				redirect.has[0].type === 'host'
					? hostMatching[redirect.has[0].value]
					: redirect.has[0].value

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
	const dotIoRedirects = await buildDotIoRedirects()
	const devPortalRedirects = await buildDevPortalRedirects()
	const { simpleRedirects, globRedirects } = splitRedirectsByType([
		...buildBetaProductOptInRedirects(),
		...dotIoRedirects,
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

module.exports = { redirectsConfig, splitRedirectsByType, groupSimpleRedirects }
