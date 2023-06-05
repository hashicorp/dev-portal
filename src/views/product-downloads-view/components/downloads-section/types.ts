/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionContextSwitcherProps } from 'components/version-context-switcher'
import { ReleaseVersion } from 'lib/fetch-release-data'
import { PackageManager } from 'views/product-downloads-view/types'

export interface DownloadsSectionProps {
	isEnterpriseMode: boolean
	packageManagers: PackageManager[]
	selectedRelease: ReleaseVersion
	versionSwitcherOptions: VersionContextSwitcherProps['options']
}
