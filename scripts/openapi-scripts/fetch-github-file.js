/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

//@ts-check

const { Octokit } = require('@octokit/core')
const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
})

/**
 * Fetch a file from GitHub using the GitHub API.
 *
 * @param {Object} req
 * @param {string} req.owner
 * @param {string} req.repo
 * @param {string} req.path
 * @param {string} req.ref
 * @returns {Promise<string>}
 */
async function fetchGithubFile({ owner, repo, path, ref }) {
	const response = await octokit.request(
		'GET /repos/{owner}/{repo}/contents/{path}',
		{ owner, repo, path, ref }
	)
	if (response.status !== 200) {
		throw new Error(
			`Failed to fetch file from GitHub: ${JSON.stringify({
				owner,
				repo,
				path,
				ref,
			})}. Response status code: ${response.status}.`
		)
	}
	const data = /** @type {{ content: string }} */ (response.data)
	const fileString = Buffer.from(data.content, 'base64').toString('utf-8')
	return fileString
}

module.exports = fetchGithubFile
