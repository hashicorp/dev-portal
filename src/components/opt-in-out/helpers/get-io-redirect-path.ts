export function getIoRedirectPath(path: string) {
	// given /waypoint/docs/blah, return docs/blah
	return path.split('/').slice(2).join('/')
}

export function generateGetIoRedirectPath(baseUrl) {
	return function getRedirectPath(path) {
		const url = new URL(getIoRedirectPath(path), baseUrl)

		url.searchParams.set('betaOptOut', 'true')

		// ensure we don't create a looping scenario if someone opts out immediately after opting-in
		url.searchParams.delete('optInFrom')

		return url.toString()
	}
}
