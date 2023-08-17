/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const fetch = getFetch()

function getFetch() {
	// Note: purposely doing a conditional require here so that
	// `@vercel/fetch` is not included in the client bundle
	if (typeof window === 'undefined') {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const createFetch = require('@vercel/fetch')
		return createFetch()
	}
	return window.fetch
}

export interface BaseModel {
	id: string
	created_at: string
	updated_at: string
}

export enum Method {
	GET = 'GET',
	POST = 'POST',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
}

export type ApiResponse<T> = {
	meta: {
		status_code: number
		status_text: string
	}
	result: T
}

export async function request<ResponseObject>(
	method: Method,
	url: string,
	opts?: {
		body?: any
		query?: any
	}
): Promise<ApiResponse<ResponseObject>> {
	const requestURL = new URL(
		url,
		process.env.NEXT_PUBLIC_INTEGRATIONS_API_BASE_URL
	)
	if (opts?.query) {
		// Sanitize the URL of any undefined values
		Object.keys(opts.query).forEach((key) => {
			if (opts.query[key] === undefined) {
				delete opts.query[key]
			}
		})
		requestURL.search = new URLSearchParams(opts.query).toString()
	}
	return await fetch(requestURL.toString(), {
		method: method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: opts?.body ? JSON.stringify(opts.body) : undefined,
	}).then((res) => {
		return res.json()
	})
}

export interface PaginationQuery {
	limit: number
	after?: string
}

type fetchFunction<T> = (
	query: PaginationQuery
) => Promise<ApiResponse<Array<T>>>

export async function fetchAllModels<Record extends BaseModel>(
	fetchFunc: fetchFunction<Record>,
	fetchedRecords?: Record[],
	after?: string
): Promise<Array<Record>> {
	// Set the query batch size
	const BATCH_SIZE = 100

	// Set the base array if it's the first call
	if (typeof fetchedRecords === 'undefined') {
		fetchedRecords = []
	}

	// Fetch them from the API, recursively
	const fetchResult = await fetchFunc({ limit: BATCH_SIZE, after })
	if (
		fetchResult.meta.status_code < 200 ||
		fetchResult.meta.status_code >= 300
	) {
		// Just throwing an error here, if something goes wrong
		// there's not anything we can do to handle.
		throw new Error(`Failed to fetch Records: ${JSON.stringify(fetchResult)}`)
	}

	if (fetchResult.result.length < BATCH_SIZE) {
		// If there's less than BATCH_SIZE flags fetched (less than
		// the limit), that means that we've fetched everything.
		return fetchedRecords.concat(fetchResult.result)
	} else {
		return fetchAllModels(
			fetchFunc,
			// Concat the result with the previous
			fetchedRecords.concat(fetchResult.result),
			// The last ID
			fetchResult.result[fetchResult.result.length - 1].id
		)
	}
}
