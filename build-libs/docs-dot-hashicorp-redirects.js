/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

//@ts-check

/** @typedef { import("next/dist/lib/load-custom-routes").Redirect } Redirect  */
/** @typedef { import("next/dist/lib/load-custom-routes").RouteHas } RouteHas */

/**
 * Note: Proxy settings are how we determine whether the Sentinel migration
 * has been launched. Once the Sentinel migration to Dev Dot is complete,
 * there's a lot here we could clean up - we'd no longer need a conditional.
 */
const proxySettings = require('./proxy-settings')

/**
 * Builds redirects for the `docs.hashicorp.com` domain.
 *
 * Returns an empty array if the Sentinel product docs are still being served
 * from `docs.hashicorp.com`, as in that case, we don't yet want to redirect.
 *
 * Otherwise, builds an array of redirects that forwards URLs for the Sentinel
 * content that used to be present on `docs.hashicorp.com` to `developer`.
 *
 * @returns {Redirect[]}
 */
function getDocsDotHashiCorpRedirects() {
	/**
	 * If Sentinel is still being proxied, then don't add any redirects.
	 * Redirects for `docs.hashicorp.com` will be handled by the `redirects.js`
	 * file in the Sentinel repo until Sentinel is migrated.
	 */
	if (typeof proxySettings['sentinel'] !== 'undefined') {
		return []
	}

	/**
	 * Otherwise, we want to redirect content formerly hosted on
	 * `docs.hashicorp.com` to `developer.hashicorp.com`.
	 */
	/** @type {Redirect[]} */
	const redirects = [
		/**
		 * Redirect the root domain.
		 *
		 * Note we redirect to `/sentinel` for consistency with the previous
		 * behaviour of `docs.hashicorp.com`. This could be changed later.
		 */
		{
			source: '/',
			destination: 'https://developer.hashicorp.com/sentinel',
			permanent: true,
		},
		// Redirect `/intro` content
		{
			source: '/sentinel/intro',
			destination: 'https://developer.hashicorp.com/sentinel/intro',
			permanent: true,
		},
		{
			source: '/sentinel/intro/:path*',
			destination: 'https://developer.hashicorp.com/sentinel/intro/:path*',
			permanent: true,
		},
		// Redirect the install page (formerly known as Downloads)
		{
			source: '/sentinel/downloads',
			destination: 'https://developer.hashicorp.com/sentinel/install',
			permanent: true,
		},
		/**
		 * Redirect `/docs` content.
		 *
		 * Note this content was formerly kind of "merged" at `/sentinel`. For
		 * example, `/sentinel/docs/foo-bar` would have been served at the URL
		 * `/sentinel/foo-bar`. To avoid collisions with `intro` content,
		 * and with the `downloads` page above, we use a negative look-ahead.
		 */
		{
			source: '/sentinel/:path((?!intro|downloads).*)',
			destination: 'https://developer.hashicorp.com/sentinel/docs/:path*',
			permanent: true,
		},
	]

	/**
	 * We want each of these redirects to apply ONLY to specific target domains,,
	 * so we need to add a `host` condition to each redirect. Note that for now,
	 * we target both `docs.hashicorp.com` (the production domain) and
	 * `sentinel-launch-redirects-test.hashicorp.vercel.app` (a test domain).
	 *
	 * TODO: actually target both, not just one, with regex.
	 */
	const targetHost = 'sentinel-launch-redirects-test.hashicorp.vercel.app'
	return redirects.map((redirect) => ({
		...redirect,
		has: [{ type: 'host', value: targetHost }],
	}))
}

module.exports = { getDocsDotHashiCorpRedirects }
