/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

async function getTutorialRedirects() {
	const url = new URL('/pages/redirects', process.env.LEARN_API_BASE_URL)
	const res = await fetch(url, {
		method: 'GET',
	})

	if (res.ok) {
		const data = await res.json()
		return JSON.parse(data.result.page_data?.redirects)
	}

	if (res.status === 404) {
		console.log('Redirects page not found')
		return []
	}

	throw new Error(`Error: ${res.status} ${res.statusText}`)
}

module.exports = { getTutorialRedirects }
