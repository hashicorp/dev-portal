const fs = require('fs')
const path = require('path')
const { isPreview } = require('../src/lib/env-checks')

/**
 * Loads redirects from the `product-redirects` folder and automatically applies the necessary host
 * condition so that the redirects apply to the correct domain. The domain is derived from the filename:
 *
 * 	`www.waypointproject.io.redirects.js` will define redirects for `www.waypointproject.io`
 */
module.exports = async function loadProxiedSiteRedirects() {
	const redirectFiles = await fs.promises.readdir(
		path.join(process.cwd(), 'proxied-redirects')
	)

	let redirects = []

	for (const redirectFile of redirectFiles) {
		// Don't apply the test redirect in production, it's an unnecessary definition and only used for testing in lower environments.
		if (
			process.env.HASHI_ENV === 'production' &&
			redirectFile === 'www.test-domain.io.redirects.js'
		) {
			continue
		}

		const domain = redirectFile.replace('.redirects.js', '')

		console.log(`[redirects] loading redirects for ${domain}`)
		let redirectsConfig = []
		try {
			redirectsConfig = require(`../proxied-redirects/${redirectFile}`)
		} catch (err) {
			console.log(`[redirects] unable to load redirects for ${domain}: `, err)
		}

		const redirectsWithHostCondition = redirectsConfig.map((redirect) =>
			addHostConditionToProxiedSiteRedirect(domain, redirect)
		)

		redirects = redirects.concat(redirectsWithHostCondition)
	}

	return redirects
}

/**
 * This is a helper util to add cookie & host matching conditions
 * @see https://nextjs.org/docs/api-reference/next.config.js/redirects#header-cookie-and-query-matching
 */
function addHostConditionToProxiedSiteRedirect(domain, redirect) {
	const hasCondition = isPreview()
		? [
				{
					type: 'cookie',
					key: 'hc_dd_proxied_site',
					value: domain,
				},
		  ]
		: [
				{
					type: 'host',
					value: domain,
				},
		  ]

	if (redirect.has) {
		redirect.has = [...redirect.has, ...hasCondition]
	} else {
		redirect.has = [...hasCondition]
	}

	return redirect
}
