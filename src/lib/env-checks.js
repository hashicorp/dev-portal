/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

//@ts-check

const proxyConfig = {}

// NOTE: this module uses CommonJS exports,
// as it must be required() into redirects and rewrites config,
// neither of which are transpiled.

const PROXIED_PRODUCTS = Object.keys(proxyConfig)

function isPreview() {
	return process.env.HASHI_ENV == 'preview'
}

/**
 *
 * @param {string=} hostname
 * @returns {string | boolean}
 */
function getProxiedProductSlug(hostname) {
	const proxiedProductSlug = PROXIED_PRODUCTS.reduce((acc, slug) => {
		if (!acc && isProxiedProduct(slug, hostname)) {
			return slug
		}
		return acc
	}, false)
	return proxiedProductSlug
}

/**
 *
 * @param {string=} hostname
 * @returns {string | boolean | undefined}
 */
function getMatchedDomain(hostname) {
	if (!hostname) {
		return
	}
	const domainProductSlug = PROXIED_PRODUCTS.reduce((acc, slug) => {
		const productHost = proxyConfig[slug].host
		if (!acc && hostname.match(new RegExp(productHost))) {
			return slug
		}
		return acc
	}, false)
	return domainProductSlug
}

/**
 *
 * @param {string} productSlug
 * @param {string=} hostname
 * @returns {boolean}
 */
function isProxiedProduct(productSlug, hostname) {
	const isDevEnvSet = process.env.DEV_IO == productSlug
	// Allow commit messages to trigger specific proxy settings,
	// but NOT if we're deploying off the main branch.
	const commitMsg =
		process.env.VERCEL_GIT_COMMIT_MESSAGE ||
		process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE ||
		''
	const commitFirstLine = commitMsg.split('\n')[0]
	const isCommitMatch = commitFirstLine.indexOf(`(${productSlug})`) !== -1
	// ... but only if NOT in production
	const commitRef =
		process.env.VERCEL_GIT_COMMIT_REF ||
		process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
	const isOnMain = commitRef == 'main'
	// When deploying to specific proxied domains,
	// this function should accurately reflect the proxied product
	const isDomainMatch = productSlug == getMatchedDomain(hostname)
	// Combine local and deployed settings
	const isLocalMatch = isDevEnvSet
	const isDeployedMatch = isDomainMatch || (isCommitMatch && !isOnMain)
	return isLocalMatch || isDeployedMatch
}

function isDeployPreview(productSlug) {
	const isProductSlugMatching =
		!productSlug || productSlug === process.env.PREVIEW_FROM_REPO

	return process.env.IS_CONTENT_PREVIEW && isProductSlugMatching
}

/**
 *
 * @param {string} productSlug
 * @returns {boolean}
 */
function isVersionedDocsEnabled(productSlug) {
	const enableVersionedDocs =
		process.env.ENABLE_VERSIONED_DOCS &&
		process.env.ENABLE_VERSIONED_DOCS !== 'false'
	return enableVersionedDocs && !isDeployPreview(productSlug)
}

module.exports = {
	getProxiedProductSlug,
	isPreview,
	isDeployPreview,
	isVersionedDocsEnabled,
}
