/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Determines if a given path corresponds to a release notes page.
 *
 * This function uses a regular expression to check if the provided path matches
 * the expected patterns for release notes pages. The patterns include:
 * - `vYYYYMM-NN/releases/YYYY/vYYYYMM-NN`
 * - `releases/YYYY/vYYYYMM-NN`
 * - `/releases/YYYY/vYYYYMM-NN`
 * - `release-notes/vX.X.X` or `/release-notes/X.X.X`
 *
 * @param path - The path to be checked.
 * @returns `true` if the path matches the release notes pattern, otherwise `false`.
 */
export const isReleaseNotesPage = (path: string): boolean => {
	const regexPatterns = [
		/(\/?releases\/\d{4}\/(v\d{6}-\d{1}))$/i,
		/\/?release-notes\/(v\d+[.|_]|(\d+[.|_]))\d+[.|_]([0-9]|x)$/i,
	]
	return regexPatterns.some((pattern) => pattern.test(path))
}
