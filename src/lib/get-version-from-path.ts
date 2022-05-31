import { VERSION_IN_PATH_REGEX } from 'constants/version-path'

/**
 * Extract the version from a path string, or an array of path segments
 */
export function getVersionFromPath(path: string): string | undefined {
  const pathSegments = path.split('/')

  const version = pathSegments.find((el) => VERSION_IN_PATH_REGEX.test(el))

  return version
}
