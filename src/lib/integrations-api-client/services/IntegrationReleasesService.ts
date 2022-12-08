/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnrichedIntegrationRelease } from '../models/EnrichedIntegrationRelease'
import type { Meta200 } from '../models/Meta200'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class IntegrationReleasesService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Create Integration Release
	 * Create a release for an integration
	 * @param product
	 * @param integration
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public createRelease(
		product: string,
		integration: string,
		requestBody?: {
			version: string
			readme?: string
		}
	): CancelablePromise<{
		meta: Meta200
		result: EnrichedIntegrationRelease
	}> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/products/{product}/integrations/{integration}/releases',
			path: {
				product: product,
				integration: integration,
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
	 * Fetch an integration release
	 * Fetch a release for an integration
	 * @param product
	 * @param integration
	 * @param release
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchRelease(
		product: string,
		integration: string,
		release: string
	): CancelablePromise<{
		meta: Meta200
		result: EnrichedIntegrationRelease
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/products/{product}/integrations/{integration}/releases/{release}',
			path: {
				product: product,
				integration: integration,
				release: release,
			},
			errors: {
				404: `Not Found`,
			},
		})
	}

	/**
	 * Update an integration release
	 * Update a release for an integration
	 * @param product
	 * @param integration
	 * @param release
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public updateRelease(
		product: string,
		integration: string,
		release: string,
		requestBody?: {
			readme?: string | null
		}
	): CancelablePromise<{
		meta: Meta200
		result: EnrichedIntegrationRelease
	}> {
		return this.httpRequest.request({
			method: 'PATCH',
			url: '/products/{product}/integrations/{integration}/releases/{release}',
			path: {
				product: product,
				integration: integration,
				release: release,
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				404: `Not Found`,
			},
		})
	}

	/**
	 * Delete an integration release
	 * Delete a release for an integration
	 * @param product
	 * @param integration
	 * @param release
	 * @returns any OK
	 * @throws ApiError
	 */
	public deleteRelease(
		product: string,
		integration: string,
		release: string
	): CancelablePromise<{
		meta: Meta200
	}> {
		return this.httpRequest.request({
			method: 'DELETE',
			url: '/products/{product}/integrations/{integration}/releases/{release}',
			path: {
				product: product,
				integration: integration,
				release: release,
			},
			errors: {
				400: `Bad Request`,
				404: `Not Found`,
			},
		})
	}
}
