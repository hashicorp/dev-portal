/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Octokit } from '@octokit/core'
import { components } from '@octokit/openapi-types'
const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
})

export interface GithubFile {
	owner: string
	repo: string
	path: string
	ref?: string
}

async function fetchGithubFile({
	owner,
	repo,
	path,
	ref,
}: GithubFile): Promise<string> {
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
	// This explicit type for data seems to be necessary to avoid TypeScript errors
	// ref: https://github.com/octokit/rest.js/issues/32
	type GetRepoContentResponseDataFile = components['schemas']['content-file']
	const data = response.data as GetRepoContentResponseDataFile
	const fileString = Buffer.from(data.content, 'base64').toString('utf-8')
	return fileString
}

export default fetchGithubFile
