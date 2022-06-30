/** matches any whitespace or % */
const RE = /(\s|%)/gi
/** decodes a URI once, and returns if it is invalid */
export const isInvalidURI = (uri: string) => {
  try {
    const res = decodeURIComponent(uri)
    return !!res.match(RE)
  } catch (err) {
    console.warn(err.message, uri)
    return true
  }
}
