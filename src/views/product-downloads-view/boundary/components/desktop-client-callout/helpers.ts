/**
 * Given a release architecture string,
 * Return a more human-readable version that represents the architecture.
 */
export function humanArch(arch: string): string {
	if (arch === '386') {
		return '32-bit'
	}
	if (arch === 'amd64') {
		return '64-bit'
	}
	return arch
}

/**
 * Given a release artifact filename, return the filename extension
 */
export function getFileExtension(filename: string): string {
	return filename.substring(filename.lastIndexOf('.') + 1, filename.length)
}
