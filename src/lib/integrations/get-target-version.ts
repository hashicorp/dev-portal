/**
 * Used in `getStaticProp` generation functions to
 * format between devdot routes and the API versions
 */

export function getTargetVersion({
	latestVersion,
	versionSlug,
}: {
	latestVersion: string
	versionSlug?: string
}): [string, boolean] {
	// The 'latest' routes won't have a /:integration/:version subpath
	// or they can accessed by /:integration/latest
	const isLatest = !versionSlug || versionSlug === 'latest'
	// The route versions are formatted as v0.x.x, so we remove the leading 'v' for the api call
	const targetVersion = isLatest ? latestVersion : versionSlug.replace(/^v/, '')

	return [targetVersion, isLatest]
}
