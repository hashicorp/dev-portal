/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const { Octokit } = require('@octokit/core')
const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
})

// This is a reasonably light smoke test to validate a GitHub token.
async function getRateLimit() {
	try {
		const { data, headers } = await octokit.request('GET /user')

		const reset = parseInt(headers['x-ratelimit-reset'])
		const remaining = parseInt(headers['x-ratelimit-remaining'])

		const resetTime = new Date(reset * 1000).getTime()
		const now = new Date().getTime()
		const diff = resetTime - now
		const minutes = Math.floor(diff / 1000 / 60)
		const seconds = Math.floor((diff / 1000) % 60)

		console.log(
			`[getRateLimit] Authenticated as ${data.login}.\n` +
				`${remaining} GitHub API calls remaining. This will reset in ${minutes} minutes ${seconds} seconds.`
		)
	} catch (error) {
		throw (
			`[getRateLimit] Error:\n\tPossible missing, invalid, or expired GITHUB TOKEN: ${error.message}.\n` +
			`\tTry running "vercel env pull" or manually adding a token to your local .env file.`
		)
	}
}

module.exports = { getRateLimit }
