/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { OperatingSystem } from 'lib/fetch-release-data'

export interface ReleaseBuild {
	os: OperatingSystem
	url: string
	filename: string
	arch: string
}

export interface BoundaryInstallerProps {
	latestVersion: string
	builds: ReleaseBuild[]
}
