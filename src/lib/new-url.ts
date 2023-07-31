/**
 * Given a string, and an _optional_ domain name,
 * Return a new URL object built from the string with `new URL()`.
 *
 * This function is intended as a light wrapper around the URL
 * constructor, with the sole purpose of not requiring a domain
 * name, and instead supply a default dummy domain name,
 * since there are several uses through our codebase where we want
 * the functionality and reliability of URL objects, but do not
 * have a meaningful domain name to supply.
 */
export default function newUrl(
	url: string | URL,
	base: string | URL = 'https://www.example.com'
): URL {
	return new URL(url, base)
}
