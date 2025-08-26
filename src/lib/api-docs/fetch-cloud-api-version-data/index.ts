/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { getJsonFilesFromGithubDir } from './fetch-json-files-from-github-dir'
import { sortDateVersionData } from '../sort-date-version-data'
// Types
import type { FileTreeEntry, GithubDir } from '../../fetch-github-file-tree'
import type { ApiDocsVersionData } from '../types'

/**
 * Extract a `versionId` from a cloud API docs spec file path.
 *
 * Note: We expect all API spec files to be found in directories in the format
 * `<releaseStage>/<versionId>`. The `versionId` is the parent dirname.
 */
function versionIdFromPath(filePath: string): string {
	const parentDirname = path.basename(path.dirname(filePath))
	return parentDirname
}

/**
 * Extract a `releaseStage` from a cloud API docs spec file path.
 *
 * Note: We expect all API spec files to be found in directories in the format
 * `<releaseStage>/<versionId>`. The `releaseStage` is the grandparent dirname.
 */
function releaseStageFromPath(filePath: string): string {
	const grandparentDirname = path.basename(path.dirname(path.dirname(filePath)))
	return grandparentDirname
}

/**
 * Given the details of a remote directory on GitHub,
 * Return API docs version data fetched and parsed from the remote directory.
 *
 * If we fail to fetch the remote directory,
 * this function will throw an error.
 *
 * If the remote directory does not contain recognized API spec `.json` files,
 * this function will return an empty array.
 */
async function fetchCloudApiVersionData(
	githubDir: GithubDir
): Promise<ApiDocsVersionData[]> {
	console.log('### fetchInfo', githubDir)
	const jsonFiles = await getJsonFilesFromGithubDir(githubDir)
	console.log('### jsonFiles', jsonFiles)
	// Parse version data out of the fetched .json files
	const versionData = jsonFiles.map((fileEntry: FileTreeEntry) => {
		// Build the full file path from the repo root
		const filePathFromRepoRoot = `${githubDir.path}/${fileEntry.path}`
		// Construct the version metadata needed to fetch static props
		const versionId = versionIdFromPath(filePathFromRepoRoot)
		const releaseStage = releaseStageFromPath(filePathFromRepoRoot)
		const sourceFile = {
			owner: githubDir.owner,
			repo: githubDir.repo,
			path: filePathFromRepoRoot,
			ref: githubDir.ref,
		}
		return { versionId, releaseStage, sourceFile }
	})

	/**
	 * If we can't find _any version data at all_, this is unexpected. It means
	 * that while the target directory may exist in `hcp-specs` (since Octokit
	 * itself didn't 404 during the call to `getJsonFilesFromGithubDir), the
	 * `.json` OpenAPI files we need weren't found.
	 *
	 * If this is the case, we throw an error! We want to know when this route is
	 * completely failing to fetch the expected OpenAPI spec data.
	 *
	 * Note that within `getOpenApiDocsStaticProps`, we handle the subtler case
	 * of _specific version data_ not existing, and 404 rather than error.
	 */
	if (!versionData || versionData.length === 0) {
		throw new Error(
			`Unexpected error fetching HCP OpenAPI spec data from "${githubDir.path}" in the "${githubDir.owner}${githubDir.repo}" repo, at ref "${githubDir.ref}". The configured "githubDir" did not seem to return any OpenAPI "*.json" specs in the expected location or folder structure. Please ensure the "githubDir" points to the correct owner, repo, path, and ref. Under the target path, specs should be found in folders structured like "<releaseStage>/<versionId>/*.json".`
		)
	}

	// Return the version data, sorted in descending order
	return sortDateVersionData(versionData)
}

export { fetchCloudApiVersionData }
