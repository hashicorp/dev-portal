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
	const lowerCaseFilterQuery = filterQuery.toLowerCase()
	const lowerCaseName = integration.name.toLowerCase()
	const lowerCaseDescription = integration.description.toLowerCase()
	const lowerCaseOrganizationSlug = integration.organization.slug.toLowerCase()

	return (
		lowerCaseName.includes(lowerCaseFilterQuery) ||
		lowerCaseDescription.includes(lowerCaseFilterQuery) ||
		lowerCaseOrganizationSlug.includes(lowerCaseFilterQuery)
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
