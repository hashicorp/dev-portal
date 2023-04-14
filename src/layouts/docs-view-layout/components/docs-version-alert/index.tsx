/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getVersionFromPath } from 'lib/get-version-from-path'
import { removeVersionFromPath } from 'lib/remove-version-from-path'
import useCurrentPath from 'hooks/use-current-path'
import VersionAlertBanner from 'components/version-alert-banner'
import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'

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
	const isLatestVersion = !versionFromPath

	// If we're viewing the latest version, we don't need an alert banner
	if (isLatestVersion) {
		return null
	}

	// find curent version in list of versions, to give VersionAlertBanner access to `releaseStage`
	const { releaseStage } = versions.find(
		(currentVersion: VersionSelectItem) =>
			currentVersion.version === versionFromPath
	)

	// Otherwise, render a version alert banner
	return (
		<VersionAlertBanner
			releaseStage={releaseStage}
			currentVersion={versionFromPath}
			latestVersionUrl={removeVersionFromPath(currentPath)}
		/>
	)
}

export { DocsVersionAlertBanner }
