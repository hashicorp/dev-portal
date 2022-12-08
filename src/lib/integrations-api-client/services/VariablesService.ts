/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Meta200 } from '../models/Meta200'
import type { Meta201 } from '../models/Meta201'
import type { Variable } from '../models/Variable'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class VariablesService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Create a Variable
	 * Create a Variable
	 * @param product
	 * @param integration
	 * @param release
	 * @param component
	 * @param variableGroup
	 * @param requestBody
	 * @returns any Created
	 * @throws ApiError
	 */
	public createVariable(
		product: string,
		integration: string,
		release: string,
		component: string,
		variableGroup: string,
		requestBody?: {
			key: string
			description?: string
			type?: string
			required?: boolean
			default_value?: string
		}
	): CancelablePromise<{
		meta: Meta201
		result: Variable
	}> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}/variable-groups/{variable_group}/variables',
			path: {
				product: product,
				integration: integration,
				release: release,
				component: component,
				variable_group: variableGroup,
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
	 * Fetch all Variables
	 * Fetch all Variables
	 * @param product
	 * @param integration
	 * @param release
	 * @param component
	 * @param variableGroup
	 * @param limit
	 * @param after
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchVariables(
		product: string,
		integration: string,
		release: string,
		component: string,
		variableGroup: string,
		limit?: string,
		after?: string,
		requestBody?: {
			key: string
			description?: string
			type?: string
			required?: boolean
			default_value?: string
		}
	): CancelablePromise<{
		meta: Meta200
		result: Array<Variable>
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}/variable-groups/{variable_group}/variables',
			path: {
				product: product,
				integration: integration,
				release: release,
				component: component,
				variable_group: variableGroup,
			},
			query: {
				limit: limit,
				after: after,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Fetch a specific Variable
	 * Fetch a specific Variable
	 * @param product
	 * @param integration
	 * @param release
	 * @param component
	 * @param variableGroup
	 * @param variable
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchVariable(
		product: string,
		integration: string,
		release: string,
		component: string,
		variableGroup: string,
		variable: string
	): CancelablePromise<{
		meta: Meta200
		result: Variable
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: ' /products/{product}/integrations/{integration}/releases/{release}/components/{component}/variable-groups/{variable_group}/variables/{variable}',
			path: {
				product: product,
				integration: integration,
				release: release,
				component: component,
				variable_group: variableGroup,
				variable: variable,
			},
			errors: {
				404: `Not Found`,
			},
		})
	}

	/**
	 * Update a Variable
	 * Update a Variable
	 * @param product
	 * @param integration
	 * @param release
	 * @param component
	 * @param variableGroup
	 * @param variable
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public updateVariable(
		product: string,
		integration: string,
		release: string,
		component: string,
		variableGroup: string,
		variable: string,
		requestBody?: {
			description?: string | null
			type?: string | null
			required?: boolean | null
			default_value?: string | null
		}
	): CancelablePromise<{
		meta: Meta200
		result: Variable
	}> {
		return this.httpRequest.request({
			method: 'PATCH',
			url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}/variable-groups/{variable_group}/variables/{variable}',
			path: {
				product: product,
				integration: integration,
				release: release,
				component: component,
				variable_group: variableGroup,
				variable: variable,
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
	 * Delete a Variable
	 * Delete a Variable
	 * @param product
	 * @param integration
	 * @param release
	 * @param component
	 * @param variableGroup
	 * @param variable
	 * @returns any OK
	 * @throws ApiError
	 */
	public deleteVariable(
		product: string,
		integration: string,
		release: string,
		component: string,
		variableGroup: string,
		variable: string
	): CancelablePromise<{
		meta: Meta200
	}> {
		return this.httpRequest.request({
			method: 'DELETE',
			url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}/variable-groups/{variable_group}/variables/{variable}',
			path: {
				product: product,
				integration: integration,
				release: release,
				component: component,
				variable_group: variableGroup,
				variable: variable,
			},
			errors: {
				404: `Not Found`,
			},
		})
	}
}
