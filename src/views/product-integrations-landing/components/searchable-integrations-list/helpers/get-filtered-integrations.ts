/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Integration } from 'lib/integrations-api-client/integration'

const getDoesMatchFilterQuery = ({
	integration,
	filterQuery,
}: {
	integration: Integration
	filterQuery: string
}) => {
	return (
		integration.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
		integration.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
		integration.organization.slug
			.toLowerCase()
			.includes(filterQuery.toLowerCase())
	)
}

const getFilteredIntegrations = ({
	integrations,
	filterQuery,
}: {
	integrations: Integration[]
	filterQuery: string
}) => {
	return integrations.filter((integration: Integration) => {
		return getDoesMatchFilterQuery({ integration, filterQuery })
	})
}

export { getDoesMatchFilterQuery, getFilteredIntegrations }
