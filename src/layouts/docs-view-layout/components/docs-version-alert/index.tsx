/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getVersionFromPath } from 'lib/get-version-from-path'
import { removeVersionFromPath } from 'lib/remove-version-from-path'
import useCurrentPath from 'hooks/use-current-path'
import VersionAlertBanner from 'components/version-alert-banner'
import { VersionSelectItem } from 'views/docs-view/loaders/remote-content'

/**
 * Renders an alert banner if the current URL indicates a non-latest version,
 * showing a link to the latest version.
 *
 * Note that the logic here is based specifically on docs URL structures.
 */
function DocsVersionAlertBanner({
	versions,
}: {
	versions: VersionSelectItem[]
}) {
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const versionFromPath = getVersionFromPath(currentPath)

	if (!versions || versions?.length === 0) {
		return null
	}

	const { version: latestVersion } = versions.find(
		(currentVersion: VersionSelectItem) =>
			currentVersion.isLatest
	)
	const isLatestVersion = !versionFromPath || versionFromPath === latestVersion

	if (isLatestVersion) {
		return null
	}

	// find current version in list of versions, to give VersionAlertBanner access to VersionSelectItem's releaseStage and label
	const { releaseStage, label } = versions.find(
		(currentVersion: VersionSelectItem) =>
			currentVersion.version === versionFromPath
	)

	return (
		<VersionAlertBanner
			releaseStage={releaseStage}
			currentVersion={label}
			latestVersionUrl={removeVersionFromPath(currentPath)}
		/>
	)
}

export { DocsVersionAlertBanner }
