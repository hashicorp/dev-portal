import type { ApiDocsVersionData } from 'views/api-docs-view/types'

export interface ApiDocsVersionAlertProps {
	isVersionedUrl: boolean
	currentVersion: ApiDocsVersionData
	latestStableVersion: ApiDocsVersionData
}
