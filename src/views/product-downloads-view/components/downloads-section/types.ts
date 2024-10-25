/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReleaseVersion } from 'lib/fetch-release-data'
import {
	PackageManager,
	SortedReleases,
} from 'views/product-downloads-view/types'

export interface DownloadsSectionProps {
	packageManagers: PackageManager[]
	selectedRelease: ReleaseVersion
	downloadsByOS: SortedReleases
}

export type InstallPageAnchorHeading = 'Next-steps' | 'Release-information'

export type BoundaryDesktopClient = 'Desktop-client'
export type BoundaryInstaller = 'Boundary-installer'
