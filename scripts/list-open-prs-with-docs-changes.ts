/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import yargs from 'yargs'
import { Octokit } from '@octokit/rest'

/**
 * Given a hashicorp repository name, return an object with two properties:
 *  - mdxPrefix: the filename prefix for MDX files
 *  - navDataPrefix: the filename prefix for nav data JSON files
 */
const getRelevantFileNamePrefixes = (repo: string) => {
	// Legacy product slug mapping
	const normalizedRepo =
		repo === 'ptfe-releases' ? 'terraform-enterprise' : repo

	// The default values that most repos use
	let mdxPrefix = 'website/content'
	let navDataPrefix = 'website/data'

	// HCP and Terraform docs content repos use slightly different values
	// Note: cloud.hashicorp.com is being renamed to hcp-docs
	if (
		normalizedRepo === 'cloud.hashicorp.com' ||
		normalizedRepo === 'hcp-docs'
	) {
		mdxPrefix = 'content'
		navDataPrefix = 'content'
	} else if (normalizedRepo === 'terraform-enterprise') {
		// Terraform Enterprise (ptfe-releases) content now lives in web-unified-docs
		mdxPrefix = 'content'
		navDataPrefix = 'content'
	} else if (normalizedRepo.startsWith('terraform')) {
		mdxPrefix = 'website/docs'
	}

	// Return the values in an object
	return { mdxPrefix, navDataPrefix }
}

/**
 * Handles describing, requiring, and parsing the arguments for the main script.
 */
const getScriptArguments = (): { repo: string } => {
	const args = yargs
		.option('repo', {
			description: 'the name of the repo under `hashicorp` to check',
		})
		.demandOption(['repo'])
		.help().argv

	// $TSFixMe
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const repo = args.repo as string

	return { repo }
}

/**
 * Given a `--repo` option, lists the HTML URLs of open PRs that have changes on
 * MDX and nav data JSON files.
 *
 * Examples of how to run this script from the root of the project:
 *
 *  - npx hc-tools ./scripts/list-open-prs-with-docs-changes.ts -- --repo waypoint
 *  - npx hc-tools ./scripts/list-open-prs-with-docs-changes.ts -- --repo vault
 *  - npx hc-tools ./scripts/list-open-prs-with-docs-changes.ts -- --repo terraform-cdk
 */
const main = async () => {
	// Get the required `repo` argument
	const { repo } = getScriptArguments()

	// Get the mdx and nav-data file name prefixes from the helper
	const { mdxPrefix, navDataPrefix } = getRelevantFileNamePrefixes(repo)

	// Create a Set to get a unique list of PRs
	const result = new Set()

	// Initialize Octokit for interacting with GitHub REST API client
	if (!process.env.GITHUB_TOKEN) {
		console.warn(
			'No GITHUB_TOKEN env variable found. Provide it to avoid rate limits with the GitHub REST API.'
		)
	}
	const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

	// Get a list of open PRs in the given repo.
	const { data: pulls } = await octokit.request(
		'GET /repos/{owner}/{repo}/pulls?state=open',
		{
			owner: 'hashicorp',
			repo: repo,
		}
	)

	// For each PR...
	for (let i = 0; i < pulls.length; i++) {
		const pull = pulls[i]
		const pullNumber = pull.number
		const pullUrl = pull.html_url

		// Get a list of the PR's files
		const { data: files } = await octokit.request(
			'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
			{
				owner: 'hashicorp',
				repo: repo,
				pull_number: pullNumber,
			}
		)

		// For each filename...
		files.forEach(({ filename }: { filename: string }) => {
			const isMdxContentFile =
				filename.startsWith(mdxPrefix) && filename.endsWith('.mdx')
			const isNavDataJsonFile =
				filename.startsWith(navDataPrefix) && filename.endsWith('nav-data.json')

			// Check if each file is an MDX or nav-data file
			if (isMdxContentFile || isNavDataJsonFile) {
				// Add the PR html_url to the results Set if it has relevant files
				result.add(pullUrl)
			}
		})
	}

	// Log the results
	const sortedResult = Array.from(result).sort()
	console.log('')
	console.log(
		`There are ${sortedResult.length} open PRs in "hashicorp/${repo}" with docs changes:\n`
	)
	sortedResult.forEach((prUrl: string) => {
		console.log(` - ${prUrl}`)
	})
	console.log('')
}

main()
