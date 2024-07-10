/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { fetchGithubFileTree } from 'lib/fetch-github-file-tree'
import type { FileTreeEntry, GithubDir } from 'lib/fetch-github-file-tree'

/**
 * Given the details of a remote directory on GitHub,
 * Return an array of JSON file tree objects fetched from GitHub.
 *
 * If the remote directory cannot be successfully fetched, or the resulting
 * response does not contain a file tree, this function throws an error.
 *
 * If the remote directory is fetched successfully, but does not contain
 * any `.json` files, this function returns an empty array.
 */
export async function getJsonFilesFromGithubDir(
	githubDir: GithubDir
): Promise<FileTreeEntry[]> {
	const gitTree = await fetchGithubFileTree(githubDir, { recursive: true })
	// Filter the data.tree for .json or yaml files
	const jsonFiles = gitTree.filter((entry: FileTreeEntry) => {
		// .json files will be blobs, filter out non-blobs
		const isBlob = entry.type === 'blob'
		if (!isBlob) {
			return false
		}
		// .json files will have a .json path extension
		//SCC// Valid OAS files will have a .json, .yml, or .yaml path extension
		const validExtensions = ['.json', '.yml', '.yaml']
		const extension = path.extname(entry.path)
		//SCC// return extension === '.json'
		return validExtensions.includes(extension)
	})
	// Return the array of json files
	return jsonFiles
}
