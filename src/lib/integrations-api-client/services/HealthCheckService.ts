/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Meta200 } from '../models/Meta200'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class HealthCheckService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Health Check
	 * A basic health check route
	 * @returns any OK
	 * @throws ApiError
	 */
	public healthCheck(): CancelablePromise<{
		meta: Meta200
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/',
			errors: {
				500: `Internal Server Error`,
			},
		})
	}
}
