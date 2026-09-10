/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

//@ts-check
const env = require('env-var')

function isPreview() {
	const HASHI_ENV = env.get('HASHI_ENV').asString()
	return HASHI_ENV === 'preview'
}

function isDeployPreview(productSlug) {
	const PREVIEW_FROM_REPO = env.get('PREVIEW_FROM_REPO').asString()
	const IS_CONTENT_PREVIEW = env.get('IS_CONTENT_PREVIEW').asBool()

	const isProductSlugMatching =
		!productSlug || productSlug === PREVIEW_FROM_REPO

	return IS_CONTENT_PREVIEW && isProductSlugMatching
}

/**
 *
 * @param {string} productSlug
 * @returns {boolean}
 */
function isVersionedDocsEnabled(productSlug) {
	const ENABLE_VERSIONED_DOCS = env
		.get('ENABLE_VERSIONED_DOCS')
		.asString()

	const enableVersionedDocs =
		ENABLE_VERSIONED_DOCS && ENABLE_VERSIONED_DOCS !== 'false'

	return enableVersionedDocs && !isDeployPreview(productSlug)
}

module.exports = {
	isPreview,
	isDeployPreview,
	isVersionedDocsEnabled,
}
