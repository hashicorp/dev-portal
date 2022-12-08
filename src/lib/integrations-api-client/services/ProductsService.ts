/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Meta200 } from '../models/Meta200'
import type { Product } from '../models/Product'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class ProductsService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Get Products
	 * Fetch all products
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchProducts(): CancelablePromise<{
		meta: Meta200
		result: Array<Product>
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/products',
		})
	}

	/**
	 * Create Product
	 * Create a product
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public createProduct(requestBody?: {
		id: string
		slug: string
		name: string
	}): CancelablePromise<{
		meta: Meta200
		result: Product
	}> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/products',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				409: `Conflict`,
			},
		})
	}

	/**
	 * Get Product
	 * Fetch a specific product
	 * @param product
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchProduct(product: string): CancelablePromise<{
		meta: Meta200
		result: Product
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/products/{product}',
			path: {
				product: product,
			},
			errors: {
				404: `Not Found`,
			},
		})
	}

	/**
	 * Update Product
	 * Update a specific product
	 * @param product
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public updateProduct(
		product: string,
		requestBody?: {
			slug?: string
			name?: string
		}
	): CancelablePromise<{
		meta: Meta200
		result: Product
	}> {
		return this.httpRequest.request({
			method: 'PATCH',
			url: '/products/{product}',
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
	 * Delete Product
	 * Delete a specific product
	 * @param product
	 * @returns any OK
	 * @throws ApiError
	 */
	public deleteProduct(product: string): CancelablePromise<{
		meta: Meta200
	}> {
		return this.httpRequest.request({
			method: 'DELETE',
			url: '/products/{product}',
			path: {
				product: product,
			},
		})
	}
}
