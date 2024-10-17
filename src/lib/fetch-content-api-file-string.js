/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const fetchFileString = require('./fetch-file-string')

/**
 * TODO: MAY be needed for migrating `hashicorp/packer` to UNIFIED DOCS
 *
 * Packer plugins are fetched from remote repositories. We have since migrated
 * away from Packer plugins, instead using our Integrations setup... but I'm
 * not 100% sure that the migration from "plugins" to "integrations" was
 * fully complete.
 *
 * If the migration _was_ fully complete, then we should be able to deprecate
 * and completely remove the `views/packer-plugins`, which is the only consumer
 * of `shim-remote-includes`, which in turn is the only consumer of this
 * function.
 *
 * It the migration was _not_ fully complete, then we need to figure out how
 * to handle this use case before migrating Packer to UNIFIED DOCS. One path
 * forward may be to fully finish the Plugins → Integrations migration.
 */
const API_URL = process.env.MKTG_CONTENT_DOCS_API
const API_ASSETS = `/api/assets`
async function fetchContentApiFileString({ product, filePath, version }) {
	const [p, v, fp] = [product, version, filePath].map(encodeURIComponent)
	const url = `${API_URL}${API_ASSETS}?product=${p}&version=${v}&asset=${fp}`
	return await fetchFileString(url)
}

module.exports = fetchContentApiFileString
