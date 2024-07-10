
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Octokit } from '@octokit/core'
import { components } from '@octokit/openapi-types'
const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
})
const yaml = require('js-yaml')

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
	const yamlExtensions = ['yml', 'yaml']

	//SCC// If the spec file is YAML, convert it to JSON before continuing
	const fileData = yamlExtensions.includes(data.name.split('.').pop())
		? JSON.stringify(Buffer.from(yaml.load(data.content), 'base64').toString('utf-8'), null, 2)
		: Buffer.from(data.content, 'base64').toString('utf-8')
		
	//SCC// const fileString = Buffer.from(data.content, 'base64').toString('utf-8')
	//const fileString = Buffer.from(fileData, 'base64').toString('utf-8')
	//const fileString = JSON.stringify(fileData, null, 2)
	console.log('------------------------------------------------------')
	console.log('fetchGithubFile: fileData')
	console.log(fileData)
	//console.log('')
	//console.log('fetchGithubFile: fileString')
	//console.log(fileString)
	console.log('------------------------------------------------------')

	//return fileString
	return fileData
}

export default fetchGithubFile
