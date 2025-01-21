/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { get, toError } from 'lib/learn-client'
import { ProductPageSchema } from 'lib/learn-client/schemas'
import { ApiPage } from '../api-types'
import {
	ProductOption,
	ThemeOption,
	ProductPage as ClientProductPage,
} from 'lib/learn-client/types'
import { formatProductPage } from './formatting'

const PAGES_API_ROUTE = '/pages'

/**
 * Given a slug which serves as a page's primary key,
 * Return the page's data from the database.
 *
 * If a page with the passed slug does not exist in the database,
 * or if another issue is encountered, an error will be thrown.
 *
 * @param slug The page's slug, which is used as its primary key.
 * Usually corresponds to the page's .yml file basename.
 */

export type PageSlugOption =
	| ProductOption
	| ThemeOption.cloud
	| 'well-architected-framework'
	| 'validated-patterns'
export async function getPage(
	slug: PageSlugOption
): Promise<ClientProductPage> {
	// Load from the content API
	const route = path.join(PAGES_API_ROUTE, slug)
	const getPageResponse = await get(route)
	// Throw an error if we have one
	if (!getPageResponse.ok) {
		const error = await toError(getPageResponse)
		throw error
	}
	const pageRecord = (await getPageResponse.json()).result
	// Format product page data
	const formattedRecord = await formatProductPage(pageRecord)
	// Note that for now, we only expect product pages,
	// so we validate accordingly. In the future, we may
	// add other page types, but have no concrete need so far.
	const { error } = ProductPageSchema.validate(formattedRecord, {
		allowUnknown: false,
		abortEarly: false,
	})
	// If we have validation errors, throw them.
	// Otherwise return the validated, formatted page record
	if (error) {
		let validationError = `Error: Content looks invalid for "${slug}".\n`
		validationError +=
			'Please resolve the following issues at the content source:\n\n'
		validationError += '---\n\n'
		validationError += error.details
			.map((errorDetail, idx) => {
				let output = ''
				const { message, context } = errorDetail
				output += `Issue ${idx + 1} of ${error.details.length}:\n`
				output += message + '.\n'
				if (context) {
					output += `Context:\n`
					output += JSON.stringify(context, null, 2) + '\n\n'
				}
				return output
			})
			.join('---\n\n')
		throw new Error(validationError)
	} else {
		return formattedRecord
	}
}

/**
 * Given the learn content API is accessible at NEXT_PUBLIC_LEARN_API_BASE_URL,
 * Return data from a GET request to the "/pages" API route.
 *
 * @returns Array of Page objects
 */
export async function getPages(): Promise<ApiPage[]> {
	// Load from the content API
	const getPagesResult = await get(PAGES_API_ROUTE)
	// Throw an error if we have one
	if (!getPagesResult.ok) {
		const error = await toError(getPagesResult)
		throw error
	}
	// Otherwise format and return all the pageRecords
	const pageRecords = (await getPagesResult.json()).result
	return await Promise.all(pageRecords.map(formatProductPage))
}
