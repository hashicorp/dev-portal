/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

//@ts-check

function isPreview() {
	return process.env.HASHI_ENV == 'preview'
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
	isPreview,
	isDeployPreview,
	isVersionedDocsEnabled,
}
