/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Meta200 } from '../models/Meta200'
import type { Organization } from '../models/Organization'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class OrganizationsService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Get Organizations
	 * Fetch all organizations
	 * @param limit
	 * @param after
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchOrganizations(
		limit?: string,
		after?: string
	): CancelablePromise<{
		meta: Meta200
		result: Array<Organization>
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/organizations',
			query: {
				limit: limit,
				after: after,
			},
		})
	}

	/**
	 * Create Organization
	 * Create an organization
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public createOrganization(requestBody?: { slug: string }): CancelablePromise<{
		meta: Meta200
		result: Organization
	}> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/organizations',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				409: `Conflict`,
			},
		})
	}

	/**
	 * Get Organization
	 * Fetch a specific organization
	 * @param organization
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchOrganization(organization: string): CancelablePromise<{
		meta: Meta200
		result: Organization
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/organizations/{organization}',
			path: {
				organization: organization,
			},
			errors: {
				404: `Not Found`,
			},
		})
	}

	/**
	 * Delete Organization
	 * Delete a specific organization
	 * @param organization
	 * @returns any OK
	 * @throws ApiError
	 */
	public deleteOrganization(organization: string): CancelablePromise<{
		meta: Meta200
	}> {
		return this.httpRequest.request({
			method: 'DELETE',
			url: '/organizations/{organizations}',
			path: {
				organization: organization,
			},
		})
	}
}
