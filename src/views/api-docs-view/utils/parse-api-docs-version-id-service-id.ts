import { isDateVersion } from './is-date-version'

/**
 * Given pathParts for a current API docs page being rendered,
 * parse out possible `versionId` and `serviceId` parts from the pathParts, and
 *
 * Return the parsed `versionId` and `serviceId`.
 * Note that one or both may be `undefined`.
 *
 * Note: only date-based versions are supported, for example "2023-01-15".
 * We'd need to update `isVersionedUrl` logic in order to support other
 * `versionId` formats.
 */
function parseApiDocsVersionIdServiceId(pathParts: string[] | undefined): {
	versionId?: string
	serviceId?: string
} {
	// If we have no path parts, we have neither a versionId or serviceId
	if (!pathParts || pathParts.length < 1) {
		return {}
	}
	// We have at least one path part. Check if it's a versionId.
	const isVersionedUrl = isDateVersion(pathParts[0])
	if (isVersionedUrl) {
		return {
			versionId: pathParts[0],
			serviceId: pathParts[1],
		}
	} else {
		return {
			serviceId: pathParts[0],
		}
	}
}

export { parseApiDocsVersionIdServiceId }
