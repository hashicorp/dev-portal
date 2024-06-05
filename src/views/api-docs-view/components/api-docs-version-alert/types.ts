/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ApiDocsVersionData } from 'lib/api-docs/types'

export interface ApiDocsVersionAlertProps {
	isVersionedUrl: boolean
	currentVersion: ApiDocsVersionData
	latestStableVersion: ApiDocsVersionData
}
