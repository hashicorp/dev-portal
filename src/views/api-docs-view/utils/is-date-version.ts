/**
 * Given a string,
 *
 * Return `true` if it matches a date version format,
 * or `false` otherwise.
 */
export function isDateVersion(maybeVersion: string) {
	return /^\d\d\d\d-\d\d-\d\d$/.test(maybeVersion)
}
