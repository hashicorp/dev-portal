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
	const jsonFiles = await getJsonFilesFromGithubDir(githubDir)
	// Parse version data out of the fetched .json files
	const versionData = jsonFiles.map((fileEntry: FileTreeEntry) => {
		// Build the full file path from the repo root
		const filePathFromRepoRoot = `${githubDir.path}/${fileEntry.path}`
		// Construct the version metadata needed to fetch static props
		const versionId = versionIdFromPath(filePathFromRepoRoot)
		const releaseStage = releaseStageFromPath(filePathFromRepoRoot)
		const targetFile = {
			owner: githubDir.owner,
			repo: githubDir.repo,
			path: filePathFromRepoRoot,
			ref: githubDir.ref,
		}
		return { versionId, releaseStage, targetFile }
	})
	// Return the version data, sorted in descending order
	return sortDateVersionData(versionData)
}

export { fetchCloudApiVersionData }
