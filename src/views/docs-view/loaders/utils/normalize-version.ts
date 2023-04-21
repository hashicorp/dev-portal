export const normalizeVersion = (version: string) => {
	if (version === 'latest') {
		return version
	}
	return version.startsWith('v') ? version : `v${version}`
}
