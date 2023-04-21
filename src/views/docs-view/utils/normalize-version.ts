export const normalizeVersion = (version) => {
	if (version === 'latest') {
		return version
	}
	return version.startsWith('v') ? version : `v${version}`
}
