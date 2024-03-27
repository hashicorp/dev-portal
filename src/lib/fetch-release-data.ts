/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import semverSort from 'semver/functions/rsort'
import semverParse from 'semver/functions/parse'
import semverValid from 'semver/functions/valid'
import { Products as HashiCorpProduct } from '@hashicorp/platform-product-meta'
import { ProductData } from 'types/products'
import { getIsEnterpriseVersion } from 'views/product-downloads-view/helpers'
import { makeFetchWithRetry } from './fetch-with-retry'

export type OperatingSystem =
	| 'darwin'
	| 'freebsd'
	| 'openbsd'
	| 'netbsd'
	| 'archlinux'
	| 'linux'
	| 'windows'

export type Version = string

export interface ReleaseVersion {
	name: HashiCorpProduct
	version: Version
	shasums: string
	shasums_signature: string
	builds:
		| {
				name: HashiCorpProduct
				version: Version
				os: OperatingSystem
				arch: string
				filename: string
				url: string
		  }[]
		| null
}
export interface ReleasesAPIResponse {
	name: HashiCorpProduct
	versions: {
		[versionNumber: string]: ReleaseVersion
	}
}

export interface GeneratedProps {
	latestVersion: Version
	product: ProductData | string
	releases: ReleasesAPIResponse
}

/**
 * There is a bit of a race condition with product releases and the metadata for
 * the latest release propagating to releases.hashicorp.com. Often all it takes
 * is a re-deploy of the website for it to work, so we're introducing a retry
 * when fetching the release data in hopes that we can avoid manual
 * intervention.
 */
const fetchWithRetry = makeFetchWithRetry(fetch, { retries: 3, delay: 1000 })

// exclude pre-releases and such
const validSemverRegex = /^\d+\.\d+\.\d+$/

export function getLatestVersionFromVersions(
	versions: ReleaseVersion[]
): string {
	// exclude pre-releases and/or versions with tags or extra metadata
	const validVersions = versions.filter(({ version }) =>
		version.match(validSemverRegex)
	)

	// using the reverse sort here to get the latest version first
	const [latestVersion] = semverSort(
		validVersions.map(({ version }) => version)
	)

	return latestVersion
}

/**
 * Given an array of versions, return the latest non-pre-release version string
 * that represents an enterprise version.
 */
export function getLatestEnterpriseVersionFromVersions(
	versions: ReleaseVersion[]
): string {
	/**
	 * We want the latest valid enterprise versions,
	 * and we want to exclude pre-releases.
	 */
	const relevantVersions = versions.filter(({ version, builds }) => {
		// First check if we're semver valid, if not, return early
		const isValid = typeof semverValid(version) === 'string'
		if (!isValid) {
			return false
		}
		// Then check if we have builds, if not, return early
		if (!Array.isArray(builds) || builds.length === 0) {
			return false
		}
		// Next check that we have a stable enterprise release
		const isEnterpriseVersion = getIsEnterpriseVersion(version)
		const { prerelease } = semverParse(version)
		const isStableRelease = prerelease.length === 0
		return isEnterpriseVersion && isStableRelease
	})
	/**
	 * Return the first array item after reverse sorting to get the latest version
	 */
	const [latestVersion] = semverSort(
		relevantVersions.map(({ version }) => version)
	)
	return latestVersion
}

/**
 * TODO: `product` should eventually just be a Product type but we have the
 * existing .io sites passing a product slug here and some newer DevDot sites
 * passing an object for the `CurrentProductContext`. This approach of allowing
 * either will make merging the `assembly-ui-v1` branch into `main` easier.
 */
export function generateStaticProps(
	product: ProductData | string,
	isEnterpriseMode: boolean = false
): Promise<{ props: GeneratedProps; revalidate: number }> {
	let productSlug: string
	if (typeof product === 'string') {
		productSlug = product
	} else if (typeof product === 'object') {
		productSlug = product.slug
	}

	return fetchWithRetry(
		`https://releases.hashicorp.com/${productSlug}/index.json`,
		{
			headers: {
				'Cache-Control': 'no-cache',
			},
		}
	)
		.then((res) => res.json())
		.then((result: ReleasesAPIResponse) => {
			const latestVersion = isEnterpriseMode
				? getLatestEnterpriseVersionFromVersions(Object.values(result.versions))
				: getLatestVersionFromVersions(Object.values(result.versions))

			return {
				// 5 minutes
				revalidate: 300,
				props: {
					releases: result,
					product,
					latestVersion,
				},
			}
		})
		.catch(() => {
			throw new Error(
				`--------------------------------------------------------
        Unable to resolve release data on releases.hashicorp.com from link
        <https://releases.hashicorp.com/${productSlug}/index.json>.
        ----------------------------------------------------------`
			)
		})
}
