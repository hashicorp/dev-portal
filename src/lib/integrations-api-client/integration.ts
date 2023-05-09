/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import {
	ApiResponse,
	BaseModel,
	fetchAllModels,
	Method,
	PaginationQuery,
	request,
} from './standard-client'

export enum Tier {
	OFFICIAL = 'official',
	PARTNER = 'partner',
	COMMUNITY = 'community',
}

export interface Flag extends BaseModel {
	slug: string
	name: string
	description: string
}

export interface Organization extends BaseModel {
	slug: string
}

export interface Product extends BaseModel {
	slug: ProductSlug
	name: string
}

export interface IntegrationComponent {
	id: string
	slug: string
	name: string
	plural_name: string
}

export interface IntegrationType extends BaseModel {
	slug: string
	name: string
	plural_name: string
	description: string
}

export interface Integration extends BaseModel {
	slug: string
	name: string | null
	description: string | null
	license_type: string | null
	license_url: string | null
	external_only: boolean
	external_url: string | null
	tier: Tier
	repo_url: string | null
	subdirectory: string | null
	hide_versions: boolean
	product: Product
	organization: Organization
	flags: Array<Flag>
	versions: string[]
	components: Array<IntegrationComponent>
	integration_type: IntegrationType | null
}

async function fetchProductIntegrations(
	productIdentifier: ProductSlug,
	query: PaginationQuery
): Promise<ApiResponse<Array<Integration>>> {
	return request<Array<Integration>>(
		Method.GET,
		`/products/${productIdentifier}/integrations`,
		{ query }
	)
}

// Fetch all Integration records for a specific Product
export async function fetchAllProductIntegrations(
	productIdentifier: ProductSlug
): Promise<Integration[]> {
	return fetchAllModels((query: PaginationQuery) =>
		fetchProductIntegrations(productIdentifier, query)
	)
}

// Fetch a single Integration record
export async function fetchIntegration(
	productIdentifier: string,
	organizationIdentifier: string,
	integrationIdentifier: string
): Promise<ApiResponse<Integration>> {
	return request<Integration>(
		Method.GET,
		`/products/${productIdentifier}/organizations/${organizationIdentifier}/integrations/${integrationIdentifier}`
	)
}
