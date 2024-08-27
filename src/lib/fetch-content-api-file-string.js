/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const fetchFileString = require('./fetch-file-string')

const API_URL = process.env.MKTG_CONTENT_DOCS_API
const API_ASSETS = `/api/assets`
async function fetchContentApiFileString({ product, filePath, version }) {
	const [p, v, fp] = [product, version, filePath].map(encodeURIComponent)
	const url = `${API_URL}${API_ASSETS}?product=${p}&version=${v}&asset=${fp}`
	return await fetchFileString(url)
}

module.exports = fetchContentApiFileString
