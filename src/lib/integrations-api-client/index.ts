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
	hide_versions: boolean
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

export async function fetchAllProductIntegrations(
	product: ProductSlug,
	fetchedIntegrations?: Integration[],
	after?: string
): Promise<Array<Integration>> {
	// Set the query batch size
	const BATCH_SIZE = 100

	// Set the base array if it's the first call
	if (typeof fetchedIntegrations === 'undefined') {
		fetchedIntegrations = []
	}

	// Fetch them from the API, recursively
	const fetchResult = await fetchProductIntegrations(product, BATCH_SIZE, after)
	if (
		fetchResult.meta.status_code < 200 ||
		fetchResult.meta.status_code >= 300
	) {
		// Just throwing an error here, if something goes wrong
		// there's not anything we can do to handle.
		throw new Error(
			`Failed to fetch Integrations. ${JSON.stringify(fetchResult)}`
		)
	}

	if (fetchResult.result.length < BATCH_SIZE) {
		// If there's less than BATCH_SIZE integrations fetched (less than
		// the limit), that means that we've fetched everything.
		return fetchedIntegrations.concat(fetchResult.result)
	} else {
		return fetchAllProductIntegrations(
			product,
			// Concat the result with the previous
			fetchedIntegrations.concat(fetchResult.result),
			// The last ID
			fetchResult.result[fetchResult.result.length - 1].id
		)
	}
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
