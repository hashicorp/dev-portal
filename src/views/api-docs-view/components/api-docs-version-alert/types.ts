/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ApiDocsVersionData } from 'views/api-docs-view/types'

export interface ApiDocsVersionAlertProps {
	isVersionedUrl: boolean
	currentVersion: ApiDocsVersionData
	latestStableVersion: ApiDocsVersionData
}
