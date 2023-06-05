/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

async function fetchFileString(url) {
	const res = await fetch(url)
	return res.text()
}

module.exports = fetchFileString
