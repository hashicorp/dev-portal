import { Octokit } from '@octokit/core'
import AdmZip from 'adm-zip'

/**
 * Initialize octokit.
 * See https://github.com/octokit/core.js#readme
 */
const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
})

/**
 * Given a repo object, with a specific `owner`, `repo`, and `ref`,
 * Return an `adm-zip` instance containing the contents of the repo.
 */
export async function fetchGithubArchiveZip(githubRepo: {
	owner: string
	repo: string
	ref: string
}): Promise<AdmZip> {
	// Fetch a zip archive of the repo
	const { data: responseData } = await octokit.request(
		'GET /repos/{owner}/{repo}/zipball/{ref}',
		{
			owner: githubRepo.owner,
			repo: githubRepo.repo,
			ref: githubRepo.ref,
			headers: { 'X-GitHub-Api-Version': '2022-11-28' },
		}
	)
	// Type guard to check that the response data is an ArrayBuffer
	if (!(responseData instanceof ArrayBuffer)) {
		throw new Error(
			'Unexpected response format in fetchGithubArchiveZip. Response data was expected to be an ArrayBuffer, but received a different type instead. This is an unexpected error and the resolution path is unclear. Use of the octokit package in fetchGithubArchiveZip may need to be revisited.'
		)
	}
	// Return an instance of AdmZip
	return new AdmZip(Buffer.from(responseData))
}
