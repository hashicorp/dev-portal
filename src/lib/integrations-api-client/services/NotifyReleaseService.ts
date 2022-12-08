/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Meta200 } from '../models/Meta200'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class NotifyReleaseService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Notify Release
	 * Notify consumption scripts that an integration release has occurred
	 * @param product
	 * @param integration
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public notifyRelease(
		product: string,
		integration: string,
		requestBody?: {
			version: string
			sha: string
		}
	): CancelablePromise<{
		meta: Meta200
	}> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/products/{product}/integrations/{integration}/notify-release',
			path: {
				product: product,
				integration: integration,
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `Unauthenticated`,
				500: `Internal Server Error`,
			},
		})
	}
}
