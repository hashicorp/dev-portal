/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { isReleaseNotesPage } from 'lib/docs/is-release-notes-page'
import path from 'node:path'
import { getValidVersions } from './get-valid-versions'
import { VersionSelectItem } from '../loaders/remote-content'

export async function fetchValidVersions(
	pathParts: string[],
	versionPathPart: string,
	basePathForLoader: string,
	versions: VersionSelectItem[],
	productSlugForLoader: string
): Promise<VersionSelectItem[]> {
	/**
	 * Filter versions to include only those where this document exists
	 */
	let pathToFetchValidVersions = pathParts.join('/')

	if (isReleaseNotesPage(pathToFetchValidVersions)) {
		/**
		 * Check specific to PTFE releases notes page, which may have a version in the path twice
		 * e.g. v202409-2/releases/2024/v202407-1
		 * Remove the first version instance, which is the docs version
		 * e.g. releases/2024/v202407-1
		 * the mdx file this page pulls from has a version in the title (e.g. 202407-1mdx)
		 * the second version is the path should not be removed for this reason.
		 * This block is here because the default (else statement below)
		 * removes all versions from the path, which is not desired for release notes.
		 */
		if (/(v\d{6}-\d{1})\/releases/i.test(pathToFetchValidVersions)) {
			pathToFetchValidVersions = pathToFetchValidVersions.replace(
				versionPathPart,
				''
			)
		}
	} else {
		// Construct a document path that the content API will recognize
		pathToFetchValidVersions = pathParts
			.filter((part) => part !== versionPathPart)
			.join('/')
	}
	const fullPath = `doc#${path.join(
		basePathForLoader,
		pathToFetchValidVersions
	)}`

	// Filter for valid versions, fetching from the content API under the hood
	const validVersions = await getValidVersions(
		versions,
		fullPath,
		productSlugForLoader
	)

	return validVersions
}
