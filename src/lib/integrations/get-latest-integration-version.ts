/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// 0.0.0 is a special release which we use for our bootstrap
// integrations, which technically will not qualify as a latest
// release.  For example, if a Bootstrap Integration upgrades
// to be a proper integration, they will need to create a new
// latest release to have it be considered for a latest release.
const zeroZeroZero = '0.0.0'

// This is a regex to match any prerelease strings,
// so we can exclude them from the possibility of being
// a latest version
const prereleaseRegex = /^[0-9]+\.[0-9]+\.[0-9]+-.*$/g

export function getLatestIntegrationVersion(
	allVersions: string[]
): string | null {
	// Filter out the versions that do not qualify for latest
	const qualifyingVersions = allVersions.filter((version) => {
		if (prereleaseRegex.test(version)) {
			return false
		}
		if (version === zeroZeroZero) {
			return false
		}
		return true
	})

	// Versions come sorted from the API (semver descending), so if we
	// have at least one qualifying version, that's the lastest.
	if (qualifyingVersions.length >= 1) {
		return qualifyingVersions[0]
	}

	// We don't have any latest version
	return null
}
