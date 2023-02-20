/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getVersionFromPath } from 'lib/get-version-from-path'
import { removeVersionFromPath } from 'lib/remove-version-from-path'
import useCurrentPath from 'hooks/use-current-path'
import VersionAlertBanner from 'components/version-alert-banner'

/**
 * Renders an alert banner if the current URL indicates a non-latest version,
 * showing a link to the latest version.
 *
 * Note that the logic here is based specifically on docs URL structures.
 */
function DocsVersionAlertBanner() {
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const currentlyViewedVersion = getVersionFromPath(currentPath)

	// If we're viewing the latest version, we don't need an alert banner
	if (!currentlyViewedVersion) {
		return null
	}

	// Otherwise, render a version alert banner
	return (
		<VersionAlertBanner
			currentVersion={currentlyViewedVersion}
			latestVersionUrl={removeVersionFromPath(currentPath)}
		/>
	)
}

export { DocsVersionAlertBanner }
