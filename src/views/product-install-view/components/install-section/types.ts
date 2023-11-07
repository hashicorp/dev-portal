/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReleaseVersion } from 'lib/fetch-release-data'
import { PackageManager } from 'views/product-install-view/types'

export interface InstallSectionProps {
	isEnterpriseMode: boolean
	packageManagers: PackageManager[]
	selectedRelease: ReleaseVersion
}
