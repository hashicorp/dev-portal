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
 * Load redirects from a content repository.
 *
 * Redirects are loaded differently depending on the build context.
 *
 * `isDeveloperBuild`:
 * For builds from `hashicorp/dev-portal`, which includes production builds
 * as well as local development and deploy previews in that repo, determine
 * the latest ref from our content API, and fetch redirects from that ref.
 * Using the ref from the content API helps to ensure that not-yet-released
 * content changes are not prematurely redirected.
 *
 * `isLocalContentBuild`:
 * For builds from the same content repository from which we're aiming to
 * fetch the redirects, we load the redirects from the local filesystem.
 * This allows authors to preview changes to redirects.
 *
 * In all other cases, we're building from a content repository that does not
 * relate to the redirects we're trying to fetch. So, we can safely ignore the
 * redirects and return early with an empty array.
 *
 * @param {string} repoName The name of the repo, owner is always `hashicorp`.
 * @param {string?} redirectsPath Optionally specify a custom path to the redirects file.
 * @returns {Promise<Redirect[]>}
 */
async function getRedirectsFromContentRepo(
	repoName,
	redirectsPath = 'website/redirects.js'
) {
	/**
	 * Note: These constants are declared for clarity in build context intent.
	 */
	const isDeveloperBuild = !process.env.IS_CONTENT_PREVIEW
	const isLocalContentBuild = isDeployPreview(repoName)
	/**
	 * Load redirects from the target repo (or return early for non-target repos).
	 */
	/** @type {string} */
	let redirectsFileString
	if (isDeveloperBuild) {
		// For `hashicorp/dev-portal` builds, load redirects remotely
		const latestContentRef = await getLatestContentRefForProduct(repoName)
		redirectsFileString = await fetchGithubFile({
			owner: 'hashicorp',
			repo: repoName,
			path: redirectsPath,
			ref: latestContentRef,
		})
	} else if (isLocalContentBuild) {
		// Load redirects from the filesystem, so that authors can see their changes
		const redirectsFilePath = path.join(process.cwd(), '../redirects.js')
		redirectsFileString = fs.readFileSync(redirectsFilePath, 'utf-8')
	} else {
		// Return early, in this build we can ignore repoName's redirects.
		return []
	}
	/**
	 * Evaluate the redirects file string, filter invalid redirects, and add
	 * a host condition for proxied sites.
	 *
	 * TODO(zachshilton): remove `addHostCondition` once Sentinel is migrated (ie once
	 * `docs.hashicorp.com/sentinel` redirects to `developer.hashicorp.com`).
	 */
	/** @type {Redirect[]} */
	const parsedRedirects = eval(redirectsFileString) ?? []
	const validRedirects = filterInvalidRedirects(parsedRedirects, repoName)
	return addHostCondition(validRedirects, repoName)
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
			getRedirectsFromContentRepo('boundary'),
			getRedirectsFromContentRepo('nomad'),
			getRedirectsFromContentRepo('vault'),
			getRedirectsFromContentRepo('waypoint'),
			getRedirectsFromContentRepo('vagrant'),
			getRedirectsFromContentRepo('packer'),
			getRedirectsFromContentRepo('consul'),
			getRedirectsFromContentRepo('terraform-docs-common'),
			getRedirectsFromContentRepo('hcp-docs', '/redirects.js'),
			/**
			 * Note: `hashicorp/ptfe-releases` is in the process of adding a
			 * `redirects.js` file. Until a release is cut and our content API
			 * has a `latestRef` corresponding to a commit with that file, we
			 * expect any attempt to fetch the redirects to 404. To account for this,
			 * we've added a temporary try-catch block here.
			 *
			 * TODO(zachshilton): remove this try-catch block, once `hashicorp/ptfe-releases` has
			 * cut a release with a `redirect.js` file and that release has been
			 * extracted by our content workflows. At that point, we'll expect the
			 * redirects.js file to exist, and only then should 404s break the build.
			 * Task: https://app.asana.com/0/1202097197789424/1205453036684673/f
			 */
			(async function getPtfeRedirects() {
				try {
					return await getRedirectsFromContentRepo('ptfe-releases')
				} catch (e) {
					if (e.toString() === 'HttpError: Not Found') {
						console.warn(
							'Redirects for "hashicorp/ptfe-releases" were not found in the latest set of content extracted by our content API. Skipping for now.'
						)
						return []
					} else {
						throw e
					}
				}
			})(),
		])
	).flat()

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
		// Note: `ptfe-releases` docs are rendered under `terraform/enterprise` URLs
		'ptfe-releases': 'terraform/enterprise',
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
