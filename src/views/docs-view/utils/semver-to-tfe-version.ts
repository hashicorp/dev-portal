import semver from 'semver'

/**
 * Expects a string like `v2022.7.1`;
 * Returns a string like `v202207-1`;
 *
 * If the input is not a valid semver, returns the input unchanged
 */
export function semverToTfeVersion(input: string): string {
	if (semver.valid(input)) {
		const { major, minor, patch } = semver.coerce(input)!
		return `v${major}${String(minor).padStart(2, '0')}-${patch}`
	}

	// passthrough
	return input
}
