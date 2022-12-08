/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IntegrationFlag } from '../models/IntegrationFlag'
import type { Meta200 } from '../models/Meta200'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class IntegrationFlagsService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Create Integration Flag
	 * Add a flag to an integration
	 * @param product
	 * @param integration
	 * @param flag
	 * @returns any OK
	 * @throws ApiError
	 */
	public createIntegrationFlag(
		product: string,
		integration: string,
		flag: string
	): CancelablePromise<{
		meta: Meta200
		result: IntegrationFlag
	}> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/products/{product}/integrations/{integration}/flags/{flag}',
			path: {
				product: product,
				integration: integration,
				flag: flag,
			},
			errors: {
				400: `Bad Request`,
				409: `Conflict`,
			},
		})
	}

	/**
	 * Delete Integration Flag
	 * Delete a flag from an integration
	 * @param product
	 * @param integration
	 * @param flag
	 * @returns any OK
	 * @throws ApiError
	 */
	public deleteIntegrationFlag(
		product: string,
		integration: string,
		flag: string
	): CancelablePromise<{
		meta: Meta200
	}> {
		return this.httpRequest.request({
			method: 'DELETE',
			url: '/products/{product}/integrations/{integration}/flags/{flag}',
			path: {
				product: product,
				integration: integration,
				flag: flag,
			},
		})
	}
}
