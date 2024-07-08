/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

//@ts-check

const fs = require('fs')
const path = require('path')

const { isDeployPreview } = require('../src/lib/env-checks')
const fetchGithubFile = require('./fetch-github-file')
const { getTutorialRedirects } = require('./tutorial-redirects')
const {
	getDocsDotHashiCorpRedirects,
} = require('./docs-dot-hashicorp-redirects')
const { packerPluginRedirects } = require('./integration-packer-redirects')

require('isomorphic-unfetch')

/** @typedef { import("next/dist/lib/load-custom-routes").Redirect } Redirect  */

// copied from src/constants/hostname-map.ts so it's usable at build-time in the next config
const HOSTNAME_MAP = {
	'docs.hashicorp.com': 'sentinel',
	'test-st.hashi-mktg.com': 'sentinel',
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
 * @param {string?} redirectsPath Optional, custom path to the redirects file.
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
	 * Evaluate the redirects file string, filter invalid redirects.
	 */
	/** @type {Redirect[]} */
	const parsedRedirects = eval(redirectsFileString) ?? []
	const validRedirects = filterInvalidRedirects(parsedRedirects, repoName)
	return validRedirects
}

async function buildProductRedirects() {
	// Fetch author-oriented redirects from product repos,
	// and merge those with dev-oriented redirects from
	// within this repository
	if (process.env.SKIP_BUILD_PRODUCT_REDIRECTS) {
		return []
	}

	const productRedirects = (
		await Promise.all([
			getRedirectsFromContentRepo('boundary'),
			getRedirectsFromContentRepo('nomad'),
			getRedirectsFromContentRepo('vault'),
			getRedirectsFromContentRepo('vagrant'),
			getRedirectsFromContentRepo('packer'),
			getRedirectsFromContentRepo('consul'),
			getRedirectsFromContentRepo('terraform-docs-common'),
			getRedirectsFromContentRepo('hcp-docs', '/redirects.js'),
			getRedirectsFromContentRepo('ptfe-releases'),
			getRedirectsFromContentRepo('sentinel'),
		])
	).flat()

	return productRedirects
}

async function buildDevPortalRedirects() {
	return [
		{
			source: '/hashicorp-cloud-platform',
			destination: '/hcp',
			permanent: true,
		},
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
		{
			source:
				'/:path(boundary|consul|nomad|packer|terraform|vagrant|vault|waypoint|sentinel)/downloads',
			destination: '/:path/install',
			permanent: true,
		},
		{
			source: '/:path(consul|nomad|vault)/downloads/enterprise',
			destination: '/:path/install/enterprise',
			permanent: true,
		},
		{
			source: '/vagrant/downloads/vmware',
			destination: '/vagrant/install/vmware',
			permanent: true,
		},
		{
			source: '/waypoint/api-docs',
			destination:
				'https://github.com/hashicorp/waypoint/blob/main/pkg/server/gen/server.swagger.json',
			permanent: true,
		},
		{
			source: '/waypoint/install',
			destination: '/waypoint/tutorials/hcp-waypoint',
			permanent: true,
		},
		{
			source: '/waypoint/commands',
			destination:
				'https://github.com/hashicorp/waypoint/tree/main/website/content/commands',
			permanent: true,
		},
		{
			source: '/waypoint/commands/:slug',
			destination:
				'https://github.com/hashicorp/waypoint/tree/main/website/content/commands',
			permanent: true,
		},
		{
			source: '/waypoint/integrations',
			destination: '/waypoint',
			permanent: true,
		},
		{
			source: '/waypoint/integrations/hashicorp/:slug',
			destination: '/waypoint',
			permanent: true,
		},
		{
			source: '/waypoint/docs/(.+$)',
			destination:
				'https://github.com/hashicorp/waypoint/tree/main/website/content/docs',
			permanent: true,
		},
		{
			source: '/certifications/networking-automation',
			destination: '/certifications/security-automation',
			permanent: true,
		},
		/**
		 * Redirects from our former Packer Plugin library to our
		 * new integrations library for Packer,
		 */
		...packerPluginRedirects,
	]
}

/**
 * Splits an array of redirects into simple (one-to-one path matches without
 * regex matching) and complex (with glob-based regex matching or conditions).
 *
 * This enables processing simple redirects via middleware, instead of the
 * built-in redirects handling. Using middleware was previously a necessity
 * as we handled a VERY large volume of redirects for the proxied `io` domains,
 * which exceeded Vercel's limits for built-in redirects handling.
 * For further details see: https://vercel.com/guides/how-can-i-increase-the-limit-of-redirects-or-use-dynamic-redirects-on-vercel
 *
 * @param {Redirect[]} redirects
 * @returns {{ simpleRedirects: Redirect[], complexRedirects: Redirect[] }}
 */
function splitRedirectsByType(redirects) {
	/** @type {Redirect[]} */
	const simpleRedirects = []

	/** @type {Redirect[]} */
	const complexRedirects = []

	redirects.forEach((redirect) => {
		const isGlobRedirect = ['(', ')', '{', '}', ':', '*', '+', '?'].some(
			(char) => redirect.source.includes(char)
		)
		const hasCondition = redirect.has?.length > 0
		if (isGlobRedirect || hasCondition) {
			complexRedirects.push(redirect)
		} else {
			simpleRedirects.push(redirect)
		}
	})

	return { simpleRedirects, complexRedirects }
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
		// Redirects for non-proxied must be prefixed with the product slug.
		const isPrefixed = entry.source.startsWith(`/${productSlug}`)
		// Keep track of invalid redirects, we want to warn about these
		const isValidRedirect = isPrefixed
		if (!isValidRedirect) {
			invalidRedirects.push(entry)
		}
		return isValidRedirect
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
	/** @type {Record<string, Record<string, { destination: string, permanent?: boolean }>>} */
	const groupedRedirects = {}
	redirects.forEach((redirect) => {
		let product
		if (redirect.has && redirect.has.length > 0) {
			if (redirect.has[0].type === 'host') {
				const hasHostValue = redirect.has[0].value

				// this handles the scenario where redirects are built through our proxy config and have the host value matching what is defined in build-libs/proxy-config.js
				product = HOSTNAME_MAP[hasHostValue]
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
	const tutorialRedirects = await getTutorialRedirects()
	const docsDotHashiCorpRedirects = getDocsDotHashiCorpRedirects()

	const { simpleRedirects, complexRedirects } = splitRedirectsByType([
		...productRedirects,
		...devPortalRedirects,
		...tutorialRedirects,
		...docsDotHashiCorpRedirects,
	])
	const groupedSimpleRedirects = groupSimpleRedirects(simpleRedirects)
	if (process.env.DEBUG_REDIRECTS) {
		console.log(
			'[DEBUG_REDIRECTS]',
			JSON.stringify({
				simpleRedirects,
				groupedSimpleRedirects,
				complexRedirects,
			})
		)
	}
	return {
		simpleRedirects: groupedSimpleRedirects,
		complexRedirects,
	}
}

module.exports = {
	redirectsConfig,
	splitRedirectsByType,
	groupSimpleRedirects,
	filterInvalidRedirects,
}
