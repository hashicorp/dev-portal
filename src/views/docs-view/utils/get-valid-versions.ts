/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utils
import { getContentApiBaseUrl } from 'lib/unified-docs-migration-utils'
// Types
import type { VersionSelectItem } from '../loaders/remote-content'
import { readFileSync } from 'fs'
import { type Redirect } from 'next'
import { resolve } from 'path'

const VERSIONS_ENDPOINT = '/api/content-versions'

/**
 * Given a list of all possible versions, as well as a document path and
 * content repo identifier for our content API,
 * Return a filter list of versions that includes only those versions
 * where this document exists.
 *
 * To determine in which versions this document exists, we make a request
 * to a content API that returns a list of strings representing known versions.
 * We use this to filter out unknown versions from our incoming version list.
 */
export async function getValidVersions(
	/**
	 * An array of version select items representing all possible versions for
	 * the content source repository in question (`productSlugForLoader`).
	 * May be undefined or empty if versioned docs are not enabled, for example
	 * during local preview.
	 */
	versions: VersionSelectItem[],
	/**
	 * A identifier for the document, consumable by our content API.
	 * For markdown documents, this is `doc#` followed by the full path of the
	 * document within the content source repository.
	 */
	fullPath: string,
	/**
	 * The product slug for the document, consumable by our content API.
	 * The naming here is difficult, as the actual function here is to identify
	 * specific content source repositories. These are often but not always
	 * product slugs. For example Terraform has multiple content source repos
	 * for different parts of the product.
	 */
	productSlugForLoader: string
): Promise<VersionSelectItem[]> {
	// If versions are falsy or empty, we can skip the API calls and return []
	if (!versions || versions.length === 0) return []
	/**
	 * We are currently migrating away from our existing content API, to a new
	 * content API backed by a unified documentation repository. If the provided
	 * `productSlugForLoader` has been flagged as migrated to unified docs, then
	 * we use the new unified docs API to fetch known versions.
	 */
	const contentApiBaseUrl = getContentApiBaseUrl(productSlugForLoader)
	try {
		const normalizedFullPath = fullPath.replace(/^doc#/, '')
		const currentPath = `/${productSlugForLoader}/${normalizedFullPath}`
		const fileContents = readFileSync(resolve('src/data/_redirects.generated.json'), 'utf8')
		const redirects: Record<'*', Record<string, Redirect>> = JSON.parse(fileContents)
		const redirect = Object.entries(redirects['*'])
			.map(([source, { destination }]) => ({ source, destination }))
			.find(({ destination, source }) => [destination, source].includes(currentPath))

		const headers = process.env.UDR_VERCEL_AUTH_BYPASS_TOKEN
			? new Headers({
					'x-vercel-protection-bypass':
						process.env.UDR_VERCEL_AUTH_BYPASS_TOKEN,
			  })
			: new Headers()

		const knownVersions: Record<string, string[]> = {
			currentPathVersions: [],
			redirectVersions: [],
		}

		const getVersions = async (path: string) => {
			const url = new URL(VERSIONS_ENDPOINT, contentApiBaseUrl)
			url.searchParams.set('product', productSlugForLoader)
			url.searchParams.set('fullPath', `doc#${path}`)
			const response = await fetch(url, { headers })
			const { versions } = await response.json()
			return versions || []
		}

		const currentPathVersions = await getVersions(currentPath)
		knownVersions.currentPathVersions.push(...currentPathVersions)

		if(redirect) {
			const redirectVersions = await Promise.all<string[]>(Object.values(redirect).map(getVersions))
			knownVersions.redirectVersions.push(...redirectVersions.flat())
		}

		const allKnownVersions = Object.values(knownVersions).flat()
			.filter((version, index, array) => array.indexOf(version) === index)

		return versions
			.filter(({ version }) => allKnownVersions.includes(version))
			.map((option) => ({
				...option,
				href: knownVersions.redirectVersions.includes(option.version) ? redirect.source : null
			}))
	} catch (error) {
		console.error(
			`[docs-view/server] error fetching known versions for "${productSlugForLoader}" document "${fullPath}". Falling back to showing all versions.`,
			error
		)
		return versions
	}
}
