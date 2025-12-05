/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { OperatingSystem } from 'lib/fetch-release-data'

export interface ReleaseBuild {
	os: OperatingSystem
	url: string
	filename: string
	arch: string
}

export interface InstallProps {
	latestVersion: string
	builds: ReleaseBuild[]
}
