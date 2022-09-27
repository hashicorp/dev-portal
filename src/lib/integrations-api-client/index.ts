import { ApiResponse, Method, request } from './standard-client'
import { ProductSlug } from 'types/products'

export interface Organization {
	id: string
	slug: string
}

export enum Tier {
	OFFICIAL = 'official',
	VERIFIED = 'verified',
	COMMUNITY = 'community',
}

export interface Component {
	id: string
	slug: string
	name: string
	plural_name: string
}

export interface Product {
	id: string
	slug: string
	name: string
}

export interface Integration {
	id: string
	slug: string
	tier: Tier
	product: Product
	name?: string
	versions?: string[]
	components?: Component[]
	repo_url: string
	subdirectory?: string
	organization?: Organization
}

export interface Release {
	id: string
	integration_id: string
	version: string
	readme: string
}

export async function fetchProductIntegrations(
	product: ProductSlug,
	limit?: number,
	after?: string
): Promise<ApiResponse<Integration[]>> {
	return request<Integration[]>(
		Method.GET,
		`/products/${product}/integrations`,
		{
			query: {
				limit: limit,
				after: after,
			},
		}
	)
}

export async function fetchIntegration(
	product: ProductSlug,
	identifier: string
): Promise<ApiResponse<Integration>> {
	return request<Integration>(
		Method.GET,
		`/products/${product}/integrations/${identifier}`
	)
}

export async function fetchIntegrationRelease(
	product: ProductSlug,
	identifier: string,
	version: string
): Promise<ApiResponse<Release>> {
	return request<Release>(
		Method.GET,
		`/products/${product}/integrations/${identifier}/releases/${version}`
	)
}
