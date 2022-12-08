/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class IntegrationReleaseComponentsService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * Get Integration Release Components
	 * Get all components for a specific integration release
	 * @param product
	 * @param integration
	 * @param release
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchReleaseComponents(
		product: string,
		integration: string,
		release: string
	): CancelablePromise<{
		meta: {
			status_code: 200
			status_text: 'OK'
		}
		result: Array<{
			id: string
			created_at: string
			updated_at: string
			readme: string | null
			integration_release_id: string
			component: {
				id: string
				created_at: string
				updated_at: string
				slug: string
				name: string
				plural_name: string
				product_id: string
			}
			variable_groups: Array<{
				id: string
				created_at: string
				updated_at: string
				integration_release_component_id: string
				variable_group_config: {
					id: string
					created_at: string
					updated_at: string
					product_id: string
					name: string
					filename: string
					stanza: string
					display_order: number
				}
				variables: Array<{
					id: string
					created_at: string
					updated_at: string
					variable_group_id: string
					key: string
					description: string | null
					type: string | null
					required: boolean | null
					default_value: string | null
				}>
			}>
		}>
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/products/{product}/integrations/{integration}/releases/{release}/components',
			path: {
				product: product,
				integration: integration,
				release: release,
			},
		})
	}

	/**
	 * Create Integration Release Component
	 * Create a new component for a specific integration release.
	 * @param product
	 * @param integration
	 * @param release
	 * @param requestBody
	 * @returns any OK
	 * @throws ApiError
	 */
	public createReleaseComponent(
		product: string,
		integration: string,
		release: string,
		requestBody?: {
			component_id: string
			readme?: string
		}
	): CancelablePromise<{
		meta: {
			status_code: 200
			status_text: 'OK'
		}
		result: {
			id: string
			created_at: string
			updated_at: string
			readme: string | null
			integration_release_id: string
			component: {
				id: string
				created_at: string
				updated_at: string
				slug: string
				name: string
				plural_name: string
				product_id: string
			}
			variable_groups: Array<{
				id: string
				created_at: string
				updated_at: string
				integration_release_component_id: string
				variable_group_config: {
					id: string
					created_at: string
					updated_at: string
					product_id: string
					name: string
					filename: string
					stanza: string
					display_order: number
				}
				variables: Array<{
					id: string
					created_at: string
					updated_at: string
					variable_group_id: string
					key: string
					description: string | null
					type: string | null
					required: boolean | null
					default_value: string | null
				}>
			}>
		}
	}> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/products/{product}/integrations/{integration}/releases/{release}/components',
			path: {
				product: product,
				integration: integration,
				release: release,
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
			},
		})
	}

	/**
	 * Get Integration Release Component
	 * Get a specific component for a specific integration release
	 * @param product
	 * @param integration
	 * @param release
	 * @param component
	 * @returns any OK
	 * @throws ApiError
	 */
	public fetchReleaseComponent(
		product: string,
		integration: string,
		release: string,
		component: string
	): CancelablePromise<{
		meta: {
			status_code: 200
			status_text: 'OK'
		}
		result: {
			id: string
			created_at: string
			updated_at: string
			readme: string | null
			integration_release_id: string
			component: {
				id: string
				created_at: string
				updated_at: string
				slug: string
				name: string
				plural_name: string
				product_id: string
			}
			variable_groups: Array<{
				id: string
				created_at: string
				updated_at: string
				integration_release_component_id: string
				variable_group_config: {
					id: string
					created_at: string
					updated_at: string
					product_id: string
					name: string
					filename: string
					stanza: string
					display_order: number
				}
				variables: Array<{
					id: string
					created_at: string
					updated_at: string
					variable_group_id: string
					key: string
					description: string | null
					type: string | null
					required: boolean | null
					default_value: string | null
				}>
			}>
		}
	}> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}',
			path: {
				product: product,
				integration: integration,
				release: release,
				component: component,
			},
			errors: {
				400: `Bad Request`,
			},
		})
	}

	/**
	 * Update Integration Release Component
	 * Update a specific component for a specific integration release.
	 * @param product
	 * @param integration
	 * @param release
	 * @param component
	 * @param requestBody Patch Body
	 * @returns any OK
	 * @throws ApiError
	 */
	public updateReleaseComponent(
		product: string,
		integration: string,
		release: string,
		component: string,
		requestBody: {
			readme: string | null
		}
	): CancelablePromise<{
		meta: {
			status_code: 200
			status_text: 'OK'
		}
		result: {
			id: string
			created_at: string
			updated_at: string
			readme: string | null
			integration_release_id: string
			component: {
				id: string
				created_at: string
				updated_at: string
				slug: string
				name: string
				plural_name: string
				product_id: string
			}
			variable_groups: Array<{
				id: string
				created_at: string
				updated_at: string
				integration_release_component_id: string
				variable_group_config: {
					id: string
					created_at: string
					updated_at: string
					product_id: string
					name: string
					filename: string
					stanza: string
					display_order: number
				}
				variables: Array<{
					id: string
					created_at: string
					updated_at: string
					variable_group_id: string
					key: string
					description: string | null
					type: string | null
					required: boolean | null
					default_value: string | null
				}>
			}>
		}
	}> {
		return this.httpRequest.request({
			method: 'PATCH',
			url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}',
			path: {
				product: product,
				integration: integration,
				release: release,
				component: component,
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
			},
		})
	}

	/**
	 * Update Integration Release Component
	 * Delete a specific component for a specific integration release.
	 * @param product
	 * @param integration
	 * @param release
	 * @param component
	 * @returns any OK
	 * @throws ApiError
	 */
	public deleteReleaseComponent(
		product: string,
		integration: string,
		release: string,
		component: string
	): CancelablePromise<{
		meta: {
			status_code: 200
			status_text: 'OK'
		}
		result: {
			id: string
			created_at: string
			updated_at: string
			readme: string | null
			integration_release_id: string
			component: {
				id: string
				created_at: string
				updated_at: string
				slug: string
				name: string
				plural_name: string
				product_id: string
			}
			variable_groups: Array<{
				id: string
				created_at: string
				updated_at: string
				integration_release_component_id: string
				variable_group_config: {
					id: string
					created_at: string
					updated_at: string
					product_id: string
					name: string
					filename: string
					stanza: string
					display_order: number
				}
				variables: Array<{
					id: string
					created_at: string
					updated_at: string
					variable_group_id: string
					key: string
					description: string | null
					type: string | null
					required: boolean | null
					default_value: string | null
				}>
			}>
		}
	}> {
		return this.httpRequest.request({
			method: 'DELETE',
			url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}',
			path: {
				product: product,
				integration: integration,
				release: release,
				component: component,
			},
			errors: {
				400: `Bad Request`,
			},
		})
	}
}
