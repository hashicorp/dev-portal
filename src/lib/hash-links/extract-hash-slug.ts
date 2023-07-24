/**
 * Given a URL string, extract the `#hash-link`, if applicable,
 * returning it without the `#`.
 *
 * If the provided string cannot be used to construct a URL,
 * then return an empty string.
 *
 * TODO: currently only works with relative paths, I think?
 * Should be updated to work with URLs with domains too.
 *
 * Great case for test cases.
 */
export function extractHashSlug(urlString: string) {
	try {
		return new URL(urlString, 'https://www.hashicorp.com').hash
	} catch {
		return ''
	}
}
