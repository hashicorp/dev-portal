/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { formatIdentifier, formatBatchQueryStr, fetchAll } from '../utils'
import { ApiCollection } from '../api-types'
import {
	identifier,
	Collection,
	getAllCollectionsOptions,
	themeIsProduct,
	ProductOption,
	CollectionLite,
} from 'lib/learn-client/types'
import { get, toError } from '../../index'
import {
	fetchAllCollectionsByProduct,
	PRODUCT_COLLECTION_API_ROUTE,
} from './fetch-product-collections'
import { formatCollection } from './formatting'
import { formatToCollectionLite } from '../tutorial/formatting'

const COLLECTION_API_ROUTE = '/collections'

// getCollection
export async function getCollection(idOrSlug: identifier): Promise<Collection> {
	const identifier = formatIdentifier(idOrSlug)

	// /collections/:id
	const route = path.join(COLLECTION_API_ROUTE, identifier)
	const getCollectionRes = await get(route)

	if (getCollectionRes.ok) {
		const res = await getCollectionRes.json()
		return formatCollection(res.result)
	}

	// This is handled by tutorial or collection template to render 404 page
	if (getCollectionRes.status === 404) {
		console.error('Learn Api Client: 404 — Collection not found')
		return null
	}

	const error = toError(getCollectionRes)
	throw error
}

// getCollections
export async function getCollections(
	idsOrSlugs: identifier[]
): Promise<Collection[]> {
	const queryStr = formatBatchQueryStr(idsOrSlugs)

	// /collections?ids|slugs=....
	const route = COLLECTION_API_ROUTE + queryStr
	const getCollectionsRes = await get(route)

	if (getCollectionsRes.ok) {
		const res = await getCollectionsRes.json()
		return res.result.map(formatCollection)
	}

	const error = toError(getCollectionsRes)
	throw error
}

/**
 * getAllCollections accepts a limit or product option.
 * The limit option allows you to specify how many collections to fetch.
 * The product option returns all collections associated with that product.
 * If no options are passed, all collections are fetched.
 */

export async function getAllCollections(
	options?: getAllCollectionsOptions
): Promise<Collection[]> {
	let collections = []

	// check if the product option is valid, i.e. not 'cloud' or 'hashicorp'
	if (options?.product && themeIsProduct(options.product.slug)) {
		/**
		 * Sentinel cannot use "theme", as the `learn-api` doesn't support a
		 * `sentinel` theme value. We expect authors to use `theme: hashicorp`
		 * on Sentinel collections. We could provide "hashicorp" here instead
		 * of `null`, but that might result in unexpected filtering out if
		 * authors use a different `theme` for any Sentinel collection.
		 */
		const theme =
			options.product.slug === 'sentinel' ? null : options.product.slug
		const allCollections = await fetchAllCollectionsByProduct(
			options.product,
			theme
		)
		collections = [...allCollections]
	} else {
		const limit = options?.limit?.toString()
		const recurse = Boolean(!limit)

		// errors handled by the `fetchAll` function
		const allCollections = (await fetchAll({
			baseUrl: COLLECTION_API_ROUTE,
			recurse,
			limit,
		})) as ApiCollection[]

		collections = [...allCollections]
	}

	return collections.map(formatCollection)
}
export async function getNextCollectionInSidebar({
	product,
	after,
}: {
	product: ProductOption
	after: string // slug of the current collection
}): Promise<CollectionLite> {
	const baseUrl = PRODUCT_COLLECTION_API_ROUTE(product)
	const params = new URLSearchParams({
		topLevelCategorySort: 'true',
		theme: product,
		limit: '1',
		startKey: after,
	})
	const route = baseUrl + `?${params.toString()}`

	const nextCollectionRes = await get(route)

	if (nextCollectionRes.ok) {
		const res = await nextCollectionRes.json()
		if (res.result.length === 0) {
			return null // this means its the last collection in the sidebar
		}

		const formattedCollection = formatToCollectionLite(res.result[0])
		return formattedCollection
	}
}

/**
 * Returns all collections within a particular 'section'
 * The sections map from the parent folder in the
 * tutorials repository. `/content/collections/waypoint/some-collection`
 * would have a section of 'waypoint'. This allows us to fetch non-product
 * associated content such as 'onboarding' and 'well-architected-framework'
 */
export async function getCollectionsBySection(
	section: string
): Promise<Collection[]> {
	const route = COLLECTION_API_ROUTE + `?section=${section}`

	const getSectionCollections = await get(route)

	if (getSectionCollections.ok) {
		const res = await getSectionCollections.json()
		if (res.result.length === 0) {
			console.warn(`No collections found for section query: ${section}`)
		}

		return res.result.map(formatCollection)
	}

	const error = toError(getSectionCollections)
	throw error
}
