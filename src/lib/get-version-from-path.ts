import {
	VERSION_IN_PATH_REGEX,
	TFE_VERSION_IN_PATH_REGEXP,
	VERSION_IN_INTEGRATIONS_PATH_REGEX,
} from 'constants/version-path'

/**
 * Extract the version from a path string, or an array of path segments
 */
export function getVersionFromPath(path: string): string | undefined {
	const pathSegments = path
		// `path` should never contain the scheme/domain/port, but just in case...
		.replace(/^https?:\/\/[a-z-:0-9.]+/i, '')
		// Strip leading slash
		.replace(/^\//i, '')
		.split('/')

	// version is only expected to be at index 2, or 3 in the case of TF-Plugins
	// - "product" will be at index 0, and "basePath" at index 1
	let version = pathSegments.find((el, i) => {
		if (i === 2 && TFE_VERSION_IN_PATH_REGEXP.test(el)) {
			return true
		}
		if ((i === 2 || i === 3) && VERSION_IN_PATH_REGEX.test(el)) {
			return true
		}
		if (i === 4 && VERSION_IN_INTEGRATIONS_PATH_REGEX.test(el)) {
			return true
		}
		return false
	})

	// Integrations paths don't have 'v', so we add it here
	if (version && !version.startsWith('v')) {
		version = `v${version}`
	}

	return version
}
