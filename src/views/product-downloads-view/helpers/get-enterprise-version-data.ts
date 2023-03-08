/**
 * Given a valid semver version string,
 * identify whether the string represents and enterprise version, and
 * Return `{ isEnterpriseVersion, versionWithoutEnterpriseId }`.
 *
 * - `isEnterpriseVersion` is `true` if the string represents an enterprise
 *   version or `false otherwise
 * - `versionWithoutEnterpriseId` is the version with the enterprise-identifying
 *   portion (`+ent`) removed. This version string can be accurately processed
 *   with semver utilities to derive additional information about the enterprise
 *   version, such as whether it is a pre-release.
 *
 * Note that our enterprise version numbers to do not seem to strictly match
 * the semver spec. In the semver spec, a build identifier such as "+ent"
 * should always appear as a suffix to the full version, including pre-release
 * identifiers. For example, we should have "1.8.0+ent" and "1.8.0-beta1+ent".
 * However, we sometimes have "1.8.0+ent" and "1.8.0+ent-beta1". This can be
 * problematic, because `semverPrerelease` accurately identifies
 * "1.8.0-beta1+ent" as being a pre-release version, but does not see
 * "1.8.0+ent-beta1" as being a pre-release version.
 *
 * Ref: https://semver.org/#backusnaur-form-grammar-for-valid-semver-versions
 *
 * With this in mind, we expect that consumers of this function will want both:
 *
 * 1. Whether the incoming `version` was marked with an enterprise build
 *    identifier, which in our versioning may appear before the pre-release ID
 * 2. The incoming `version` stripped of the enterprise build ID if applicable,
 *    which should yield a more strictly valid version ID which can be further
 *    processed to accurately identify pre-release identifiers and so on.
 *
 * So, we return `isEnterpriseVersion` and `versionWithoutEnterpriseId`
 * rather than a simpler boolean.
 */
export function getEnterpriseVersionData(version: string): {
	isEnterpriseVersion: boolean
	versionWithoutEnterpriseId: string
} {
	/**
	 * Enterprise versions are identified by `+ent` after the major.minor.patch
	 * part of the version string. They may be before any `-pre` identifiers.
	 * We assume the incoming string is semver valid, so there is no need
	 * to test that the `+ent` string appears after a valid `x.y.z` version.
	 */
	const entVersionRegex = /\+ent/
	const isEnterpriseVersion = entVersionRegex.test(version)
	const versionWithoutEnterpriseId = version.replace(entVersionRegex, '')
	return { isEnterpriseVersion, versionWithoutEnterpriseId }
}
