/**
 * Used in `getStaticProp` generation functions to
 * format between devdot routes and the API versions
 */

export function getTargetVersion(
	version: string,
	latest: string
): [string, boolean] {
	const isLatest = !version || version === 'latest'
	// The route versions are formatted as v0.x.x, so we remove the leading 'v' for the api call
	const targetVersion = isLatest ? latest : version.replace(/^v/, '')

	return [targetVersion, isLatest]
}
