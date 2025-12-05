/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ApiDocsVersionData } from 'lib/api-docs/types'

export interface ApiDocsVersionAlertProps {
	isVersionedUrl: boolean
	currentVersion: ApiDocsVersionData
	latestStableVersion: ApiDocsVersionData
	basePath: string
}
