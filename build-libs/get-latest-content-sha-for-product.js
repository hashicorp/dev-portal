/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * We're using the docs endpoints to fetch the latest SHA, so we use
 * the env var for the docs API.
 */
const MKTG_CONTENT_DOCS_API = process.env.MKTG_CONTENT_DOCS_API

/**
 * A map of all possible `product` slugs to known content API endpoints that
 * will return an object with a `ref` property that accurately reflects the
 * ref from which the latest content was uploaded.
 */
const KNOWN_LATEST_REF_ENDPOINTS = {
	boundary: '/api/content/boundary/nav-data/latest/docs',
	nomad: '/api/content/nomad/nav-data/latest/docs',
	vault: '/api/content/vault/nav-data/latest/docs',
	vagrant: '/api/content/vagrant/nav-data/latest/docs',
	packer: '/api/content/packer/nav-data/latest/docs',
	consul: '/api/content/consul/nav-data/latest/docs',
	'terraform-docs-common':
		'/api/content/terraform-docs-common/nav-data/latest/docs',
	'hcp-docs': '/api/content/hcp-docs/nav-data/latest/docs',
	'ptfe-releases': '/api/content/ptfe-releases/nav-data/latest/enterprise',
	sentinel: '/api/content/sentinel/nav-data/latest/sentinel',
}

/**
 * Fetch the latest sha from the content API for a given product.
 * This relies on known `nav-data` endpoints for each product.
 *
 * @param {string} product
 * @returns {Promise<string>}
 */
async function getLatestContentShaForProduct(product) {
	const contentUrl = new URL(MKTG_CONTENT_DOCS_API)
	const knownEndpoint = KNOWN_LATEST_REF_ENDPOINTS[product]
	if (!knownEndpoint) {
		throw new Error(
			`getLatestContentShaForProduct failed, with unknown product: ${product}. Please add a known endpoint for this product to KNOWN_LATEST_REF_ENDPOINTS.`
		)
	}
	contentUrl.pathname = knownEndpoint
	const latestSha = await fetch(contentUrl.toString())
		.then((resp) => resp.json())
		.then((json) => json.result.sha)
	return latestSha
}

module.exports = getLatestContentShaForProduct
