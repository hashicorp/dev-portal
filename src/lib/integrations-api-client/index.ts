import { ApiResponse, Method, request } from './standard-client'
import { ProductSlug } from 'types/products'

export interface Organization {
	id: string
	slug: string
}

export enum Tier {
	OFFICIAL = 'official',
	/** @deprecated - use {@link Tier.PARTNER} instead */
	VERIFIED = 'verified',
	PARTNER = 'partner',
	COMMUNITY = 'community',
}

export interface Component {
	id: string
	slug: string
	name: string
	plural_name: string
	product_id: string
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
	releases: Release[]
	flags: $TSFixMe[]
	description?: string
	repo_url: string
	subdirectory?: string
	organization?: Organization
}

export interface IntegrationReleaseComponent {
	id: string
	component_id: string
	integration_release_id: string
	readme: string | null
	created_at: string
	updated_at: string
	component: Component
}

export interface Release {
	id: string
	integration_id: string
	version: string
	readme: string
	components?: IntegrationReleaseComponent[]
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
