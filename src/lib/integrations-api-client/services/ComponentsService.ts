/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Component } from '../models/Component'
import type { Meta200 } from '../models/Meta200'
import type { Meta201 } from '../models/Meta201'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class ComponentsService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Get Components
	 * Fetch all components for a specific product
	 * @param product
	 * @param limit
	 * @param after
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchComponents(
		product: string,
		limit?: string,
		after?: string
	): CancelablePromise<{
		meta: Meta200
		result: Array<Component>
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/products/{product}/components',
			path: {
				product: product,
			},
			query: {
				limit: limit,
				after: after,
			},
		})
	}

	/**
	 * Create Component
	 * Create a component
	 * @param product
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public createComponent(
		product: string,
		requestBody?: {
			id: string
			slug: string
			name: string
			plural_name: string
		}
	): CancelablePromise<{
		meta: Meta201
		result: Component
	}> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/products/{product}/components',
			path: {
				product: product,
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
	 * Get Component
	 * Fetch a specific Component
	 * @param product
	 * @param component
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchComponent(
		product: string,
		component: string
	): CancelablePromise<{
		meta: Meta200
		result: Component
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/products/{product}/components/{component}',
			path: {
				product: product,
				component: component,
			},
			errors: {
				404: `Not Found`,
			},
		})
	}

	/**
	 * Update Component
	 * Update a specific component
	 * @param product
	 * @param component
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public updateComponent(
		product: string,
		component: string,
		requestBody?: {
			slug?: string
			name?: string
			plural_name?: string
		}
	): CancelablePromise<{
		meta: Meta200
		result: Component
	}> {
		return this.httpRequest.request({
			method: 'PATCH',
			url: '/products/{product}/components/{component}',
			path: {
				product: product,
				component: component,
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
	 * Delete Component
	 * Delete a specific component
	 * @param product
	 * @param component
	 * @returns any OK
	 * @throws ApiError
	 */
	public deleteComponent(
		product: string,
		component: string
	): CancelablePromise<{
		meta: Meta200
	}> {
		return this.httpRequest.request({
			method: 'DELETE',
			url: '/products/{product}/components/{component}',
			path: {
				product: product,
				component: component,
			},
		})
	}
}
