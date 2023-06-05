/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ApiResponse, BaseModel, Method, request } from './standard-client'

interface Component extends BaseModel {
	slug: string
	name: string
	plural_name: string
	product_id: string
}

interface VariableGroupConfig extends BaseModel {
	product_id: string
	name: string
	filename: string
	stanza: string
	display_order: number
}

export interface Variable extends BaseModel {
	variable_group_id: string
	key: string
	description: string | null
	type: string | null
	required: boolean | null
	default_value: string | null
}

export interface VariableGroup extends BaseModel {
	variable_group_config: VariableGroupConfig
	integration_release_component_id: string
	variables: Array<Variable>
}

export interface ReleaseComponent extends BaseModel {
	component_id: string
	integration_release_id: string
	name: string
	slug: string
	readme: string | null
	component: Component
	variable_groups: Array<VariableGroup>
}

export interface Release extends BaseModel {
	integration_id: string
	version: string
	readme: string
	components: Array<ReleaseComponent>
}

// Fetch a single Integration record
export async function fetchIntegrationRelease(
	productIdentifier: string,
	organizationIdentifier: string,
	integrationIdentifier: string,
	releaseIdentifier: string
): Promise<ApiResponse<Release>> {
	return request<Release>(
		Method.GET,
		`/products/${productIdentifier}/organizations/${organizationIdentifier}/integrations/${integrationIdentifier}/releases/${releaseIdentifier}`
	)
}
