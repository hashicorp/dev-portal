/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Flag } from '../models/Flag'
import type { Meta200 } from '../models/Meta200'
import type { Meta201 } from '../models/Meta201'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class FlagsService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Create Flag
	 * Create a flag
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public createFlag(requestBody?: {
		id?: string
		slug: string
		name: string
		description: string
	}): CancelablePromise<{
		meta: Meta201
		result: Flag
	}> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/flags',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				409: `Conflict`,
			},
		})
	}

	/**
	 * Get Flags
	 * Fetch all flags
	 * @param limit
	 * @param after
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchFlags(
		limit?: string,
		after?: string
	): CancelablePromise<{
		meta: Meta200
		result: Array<Flag>
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/flags',
			query: {
				limit: limit,
				after: after,
			},
		})
	}

	/**
	 * Get Flag
	 * Fetch a specific Flag
	 * @param flag
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchFlag(flag: string): CancelablePromise<{
		meta: Meta200
		result: Flag
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/flags/{flag}',
			path: {
				flag: flag,
			},
			errors: {
				404: `Not Found`,
			},
		})
	}

	/**
	 * Update Flag
	 * Update a specific Flag
	 * @param flag
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public updateFlag(
		flag: string,
		requestBody?: {
			slug?: string
			name?: string
			description?: string
		}
	): CancelablePromise<{
		meta: Meta200
		result: Flag
	}> {
		return this.httpRequest.request({
			method: 'PATCH',
			url: '/flags/{flag}',
			path: {
				flag: flag,
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				409: `Conflict`,
			},
		})
	}

	/**
	 * Delete Flag
	 * Delete a specific Flag
	 * @param flag
	 * @returns any OK
	 * @throws ApiError
	 */
	public deleteFlag(flag: string): CancelablePromise<{
		meta: Meta200
	}> {
		return this.httpRequest.request({
			method: 'DELETE',
			url: '/flags/{flag}',
			path: {
				flag: flag,
			},
		})
	}
}
