/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import semverPrerelease from 'semver/functions/prerelease'
import semverValid from 'semver/functions/valid'
import semverSort from 'semver/functions/rsort'
import { Products as HashiCorpProduct } from '@hashicorp/platform-product-meta'
import { ProductData } from 'types/products'
import { getEnterpriseVersionData } from 'views/product-downloads-view/helpers/get-enterprise-version-data'
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
	builds: {
		name: HashiCorpProduct
		version: Version
		os: OperatingSystem
		arch: string
		filename: string
		url: string
	}[]
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

export function getLatestVersionFromVersions(versions: string[]): string {
	// exclude pre-releases and/or versions with tags or extra metadata
	const validVersions = versions.filter((version) =>
		version.match(validSemverRegex)
	)

	// using the reverse sort here to get the latest version first
	const [latestVersion] = semverSort(validVersions)

	return latestVersion
}

/**
 * Given an array of version strings,
 * Return the latest non-pre-release version string that represents
 * and enterprise version.
 */
export function getLatestEnterpriseVersionFromVersions(
	versions: string[]
): string {
	/**
	 * We want the latest valid enterprise versions,
	 * and we want to exclude pre-releases.
	 */
	const relevantVersions = versions.filter((version: string) => {
		const isValid = typeof semverValid(version) === 'string'
		const { isEnterpriseVersion, versionWithoutEnterpriseId } =
			getEnterpriseVersionData(version)
		const isPrerelease = semverPrerelease(versionWithoutEnterpriseId) !== null
		return isValid && isEnterpriseVersion && !isPrerelease
	})
	/**
	 * Return the first array item after reverse sorting to get the latest version
	 */
	const [latestVersion] = semverSort(relevantVersions)
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
		.then((result) => {
			const latestVersion = isEnterpriseMode
				? getLatestEnterpriseVersionFromVersions(Object.keys(result.versions))
				: getLatestVersionFromVersions(Object.keys(result.versions))

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
