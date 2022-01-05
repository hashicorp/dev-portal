/**
 * Given a string,
 * return true if the string is an absolute URL,
 * or false otherwise.
 *
 * Uses regex so may not be 100% accurate.
 * Based on https://github.com/sindresorhus/is-absolute-url
 *
 * @param string The URL to test
 * @returns
 */
function isAbsoluteUrl(string: string): boolean {
  const regex = /^[a-zA-Z][a-zA-Z\d+\-.]*:/
  return regex.test(string)
}

export default isAbsoluteUrl
