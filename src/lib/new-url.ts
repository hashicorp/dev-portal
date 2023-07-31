/**
 * Given a string, and an _optional_ domain name,
 * Return a new URL object built from the string with `new URL()`.
 *
 * This function is intended as a light wrapper around the URL
 * constructor, with the sole purpose of not requiring a domain
 * name, and instead supply a default domain name,
 * since there are several uses through our codebase where we want
 * the functionality and reliability of URL objects, but do not
 * have a meaningful domain name to supply.
 *
 * Note that we use `example.com` here since we do _not_ want to rely
 * on a specific domain name value here. If a specific domain name
 * is needed, consumers should pass that domain to the `base` argument,
 * or use `new URL(url, base)` directly.
 */
export default function newUrl(
	url: string | URL,
	base: string | URL = 'https://www.example.com'
): URL {
	return new URL(url, base)
}
