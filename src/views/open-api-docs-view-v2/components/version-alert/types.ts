/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

export interface OpenApiV2VersionAlertProps {
	isVersionedUrl: boolean
	currentVersion: { versionId: string; releaseStage?: string }
	latestStableVersion: { versionId: string }
	basePath: string
}
