/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { fetchFileTreeFromGithub } from './fetch-file-tree-from-github'
import type { FileTreeEntry, GithubDir } from './fetch-file-tree-from-github'

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
	const gitTree = await fetchFileTreeFromGithub(githubDir, { recursive: true })
	// Filter the data.tree for .json files
	const jsonFiles = gitTree.filter((entry: FileTreeEntry) => {
		// .json files will be blobs, filter out non-blobs
		const isBlob = entry.type === 'blob'
		if (!isBlob) {
			return false
		}
		// .json files will have a .json path extension
		const extension = path.extname(entry.path)
		return extension === '.json'
	})
	// Return the array of json files
	return jsonFiles
}
