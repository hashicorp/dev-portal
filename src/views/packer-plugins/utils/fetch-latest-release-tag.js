/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const fetch = require('node-fetch')

/**
 * @param {string} repo
 * @returns {Promise<string|boolean>}
 */
async function fetchLatestReleaseTag(repo) {
	const latestReleaseUrl = `https://github.com/${repo}/releases/latest`
	let res = await fetch(latestReleaseUrl, {
		headers: {
			Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
		},
	})

	if (res.status !== 200) {
		console.error(
			`failed to fetch: ${latestReleaseUrl}`,
			res.status,
			res.statusText
		)

		if (res.status === 429) {
			console.error(
				'GitHub API rate limit exceeded: Double check that a `GITHUB_TOKEN` environment variable is set.'
			)
		}

		return false
	}

	const matches = res.url.match(/tag\/(.*)/)

	if (!matches) {
		console.error(`failed to parse tag from: ${res.url}`)
		return false
	}

	return matches[1]
}

module.exports = fetchLatestReleaseTag
