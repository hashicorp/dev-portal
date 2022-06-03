const VERSION_REGEXP = /v\d+\.\d+\.(\d+|\w+)/g
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
    .replace(VERSION_REGEXP, '') // strip version
    .replace(LEADING_TRAILING_SLASHES_REGEXP, '') // strip leading and trailing slashes

  return '/' + basePath + '/' + version + (rest ? `/${rest}` : '')
}
