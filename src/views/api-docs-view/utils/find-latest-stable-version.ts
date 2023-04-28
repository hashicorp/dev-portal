import { ApiDocsVersionData } from '../types'

/**
 * Given an array of version data,
 * Return the latest `stable` version.
 *
 * Note: only supports date-based version formats, for example "2023-01-15".
 * We'd need to update the sort logic in order to support other formats.
 */
function findLatestStableVersion(
	versionData: ApiDocsVersionData[]
): ApiDocsVersionData {
	// If we have exactly one version, we assume it's the latest stable version.
	if (versionData.length === 1) {
		return versionData[0]
	}
	// Sort versions in descending order
	const versionsDescending = versionData.sort((a, b) => {
		// We expect consistent YYYY-MM-DD formatting, so string compare works fine
		const aBeforeB = a.versionId > b.versionId
		const bBeforeA = b.versionId > a.versionId
		return aBeforeB ? -1 : bBeforeA ? 1 : 0
	})
	// Return the first 'stable' release we can find in descending versions
	return versionsDescending.find((v) => v.releaseStage === 'stable')
}

export { findLatestStableVersion }
