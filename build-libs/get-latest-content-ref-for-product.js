/**
 * Fetch the latest ref from the content API to ensure the redirects are accurate.
 *
 * TODO: refactor to fetch from known nav-data, rather than from version
 * metadata. Intent being to allow upstream changes to version metadata such
 * that version metadata `ref` will only be updated when version metadata is
 * actually updated (as opposed to on every content upload, as is currently
 * the case).
 *
 * @param {string} product
 * @returns {Promise<string>}
 */
async function getLatestContentRefForProduct(product) {
	const contentUrl = new URL('https://content.hashicorp.com')
	contentUrl.pathname = `/api/content/${product}/version-metadata/latest`
	const latestRef = await fetch(contentUrl.toString())
		.then((resp) => resp.json())
		.then((json) => json.result.ref)

	return latestRef
}

module.exports = getLatestContentRefForProduct
