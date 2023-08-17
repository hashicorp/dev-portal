/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Octokit } from '@octokit/core'
import { buildQueryStringSuffix } from './build-query-string-suffix'

/**
 * Initialize octokit.
 * See https://github.com/octokit/core.js#readme
 */
const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
})

/**
 * Details for a directory to fetch from GitHub.
 */
export interface GithubDir {
	owner: string
	ref: string
	path: string
	repo: string
}

/**
 * An incomplete but still useful type representing a file tree entry
 * returned from GitHub's API.
 */
export interface FileTreeEntry {
	type: string
	path: string
}

/**
 * Given the details of a remote directory on GitHub,
 * Return an array of file tree objects fetched from GitHub.
 *
 * If the remote directory cannot be successfully fetched, or the resulting
 * response does not contain a file tree, this function throws an error.
 */
export async function fetchFileTreeFromGithub(
	githubDir: GithubDir,
	options: { recursive?: boolean } = {}
): Promise<FileTreeEntry[]> {
	/**
	 * Fetch the git tree for the target directory, so we can see files within
	 * Ref: https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#about-git-trees
	 */
	const tree_sha = `${githubDir.ref}:${githubDir.path}`
	// Set up query params for the request, to allow recursive trees
	const queryString = buildQueryStringSuffix(options)
	// Make the octokit request
	const response = await octokit.request(
		`GET /repos/{owner}/{repo}/git/trees/{tree_sha}${queryString}`,
		{
			owner: githubDir.owner,
			repo: githubDir.repo,
			tree_sha,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
			},
		}
	)
	// Handle errors
	if (response.status !== 200) {
		throw new Error(
			`Failed to fetch directory tree from GitHub: ${JSON.stringify(
				githubDir
			)}. Response status code: ${response.status}.`
		)
	}
	// We expect data.tree to be an array, if it's not, bail
	if (!Array.isArray(response.data.tree)) {
		throw new Error(
			`Unexpected directory tree data from GitHub: ${JSON.stringify(
				githubDir
			)}. Expected data.tree to be an array, but found something else. Stringified tree: ${JSON.stringify(
				response.data.tree
			)}`
		)
	}
	return response.data.tree
}
