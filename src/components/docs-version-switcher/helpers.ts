/**
 * Copied from @hashicorp/react-version-select on 2022-05-24
 * @see https://github.com/hashicorp/react-components/blob/22a02a47f5dcac983e98f0f3096cf0a785447f7d/packages/version-select/util.ts
 */

const REGEX = /^v\d+\.\d+\.(\d+|\w+)$/i

/**
 * Extract the version from a path string, or an array of path segments
 */
function getVersionFromPath(path: string): string | undefined {
  const pathSegments = path.split('/')

  const version = pathSegments.find((el) => REGEX.test(el))

  return version
}

/**
 * Removes a version string from a path, and returns the new path.
 * Returns the original string if no version is present.
 */
function removeVersionFromPath(path: string): string {
  const pathSegments = path.split('/')

  const i = pathSegments.findIndex((el) => REGEX.test(el))

  if (i > -1) {
    return [...pathSegments.slice(0, i), ...pathSegments.slice(i + 1)].join('/')
  } else {
    return path
  }
}

const VERSION_REGEXP = /v\d+\.\d+\.(\d+|\w+)/g
const LEADING_TRAILING_SLASHES_REGEXP = /^\/+|\/+$/g

interface GetTargetPathArgs {
  basePath: string
  asPath: string
  version: string
}
// Get a target path for router navigation; Handles dynamic basePath
function getTargetPath({
  basePath,
  asPath,
  version,
}: GetTargetPathArgs): string {
  const rest = asPath
    .replace(basePath, '') // strip basePath
    .replace(VERSION_REGEXP, '') // strip version
    .replace(LEADING_TRAILING_SLASHES_REGEXP, '') // strip leading and trailing slashes

  return '/' + basePath + '/' + version + (rest ? `/${rest}` : '')
}

export { getTargetPath, getVersionFromPath, removeVersionFromPath }
