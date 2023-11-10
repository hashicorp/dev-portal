/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReleasesAPIResponse } from 'lib/fetch-release-data'
import semverMajor from 'semver/functions/major'
import semverMinor from 'semver/functions/minor'
import semverPatch from 'semver/functions/patch'
import semverSatisfies from 'semver/functions/satisfies'

/**
 * Pulled from terraform-website/pages/downloads/index.jsx on 2022-03-09:
 * https://github.com/hashicorp/terraform-website/blob/master/pages/downloads/index.jsx#L55-L98
 *
 * Modified 2022-03-28 to replace semverGte with semverSatisfies,
 * as the former seemed to return pre-releases, which is not what we want.
 */
function filterVersions(
	versions: ReleasesAPIResponse['versions'],
	versionRange: string
): ReleasesAPIResponse['versions'] {
	// Filter by arbitrary & reasonable version cutoff
	const filteredVersions = Object.keys(versions).filter(
		(versionNumber: string) => {
			return semverSatisfies(versionNumber, versionRange)
		}
	)
	/**
	 * Computes the latest patch versions for each major/minor
	 * e.g. given [1.1.2, 1.1.1, 1.1.0, 1.0.9, 1.0.8]
	 * return [1.1.2, 1.0.9]
	 */
	const tree: { [x: number]: { [y: number]: number } } = {}
	filteredVersions.forEach((v: string) => {
		const x = semverMajor(v)
		const y = semverMinor(v)
		const z = semverPatch(v)

		if (!tree[x]) {
			tree[x] = { [y]: z }
		} else if (!tree[x][y]) {
			tree[x][y] = z
		} else {
			tree[x][y] = Math.max(tree[x][y], z)
		}
	})

	// Turn the reduced tree of latest patches only into an array
	const latestPatchesOnly = []
	Object.entries(tree).forEach(([x, xObj]) => {
		Object.entries(xObj).forEach(([y, z]) => {
			latestPatchesOnly.unshift(`${x}.${y}.${z}`)
		})
	})

	// Turn the array of latest patches only into an object with release data
	const filteredVersionsObj = {}
	latestPatchesOnly.forEach((versionNumber: string) => {
		filteredVersionsObj[versionNumber] = versions[versionNumber]
	})
	return filteredVersionsObj
}

export default filterVersions
