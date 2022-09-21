import {
	TFE_VERSION_IN_PATH_REGEXP,
	VERSION_IN_PATH_REGEX,
} from 'constants/version-path'

const LEADING_TRAILING_SLASHES_REGEXP = /^\/+|\/+$/g

interface GetTargetPathArgs {
	basePath: string
	asPath: string
	version: string
}

/**
 * Get a target path for router navigation; Handles dynamic basePath
 */
export function getTargetPath({
	basePath,
	asPath,
	version,
}: GetTargetPathArgs): string {
	const rest = asPath
		.replace(basePath, '') // strip basePath
		.replace(VERSION_IN_PATH_REGEX, '') // strip version
		.replace(TFE_VERSION_IN_PATH_REGEXP, '') // strip TFE version
		.replace(LEADING_TRAILING_SLASHES_REGEXP, '') // strip leading and trailing slashes

	return '/' + basePath + '/' + version + (rest ? `/${rest}` : '')
}
