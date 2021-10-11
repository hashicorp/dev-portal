const REGEX = /^v([0-9]+)\.([0-9]+)\.(x|[0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/i

/**
 * Given an array of strings, returns a tuple of
 * - [0]: a version or 'latest'
 * - [1]: an array without the version
 * @param {string[]} pathParams
 * @returns {[string, string[]]} [version, strippedParams]
 */
export const stripVersionFromPathParams = (
  pathParams = []
): [string, string[]] => {
  const index = pathParams.findIndex((e) => REGEX.test(e))
  let version = 'latest'
  let params = [...pathParams]

  if (index > -1) {
    version = pathParams[index]
    params = [...params.slice(0, index), ...params.slice(index + 1)]
  }

  return [version, params]
}

export const normalizeVersion = (version) => {
  if (version === 'latest') return version
  return version.startsWith('v') ? version : `v${version}`
}
