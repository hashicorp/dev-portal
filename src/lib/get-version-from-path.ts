const REGEX = /^v\d+\.\d+\.(\d+|\w+)$/i

/**
 * Extract the version from a path string, or an array of path segments
 */
export function getVersionFromPath(path: string): string | undefined {
  const pathSegments = path.split('/')

  const version = pathSegments.find((el) => REGEX.test(el))

  return version
}
