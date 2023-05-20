import { type ReactNode } from 'react'
import {
	Flag,
	Integration,
	IntegrationComponent,
	IntegrationType,
	Tier,
} from 'lib/integrations-api-client/integration'

interface IntegrationsSearchContextState {
	atLeastOneFacetSelected: boolean
	clearFilters: () => void
	filteredIntegrations: Integration[]
	integrations: Integration[]
	isLoading: boolean
	page: number
	pageSize: number
	paginatedIntegrations: Integration[]
	queryParams: {
		components: IntegrationComponent['slug'][]
		tiers: string[] // not sure how to make this work with the enum
		flags: Flag['slug'][]
		types: IntegrationType['slug'][]
		page: number
		pageSize: number
		filterQuery: string
	}
	resetPage: () => void
	setFilterQuery: (newValue: string) => void
	setPage: (newValue: number) => void
	setPageSize: (newValue: number) => void
	toggleComponentChecked: (component: IntegrationComponent) => void
	toggleFlagChecked: (flag: Flag) => void
	toggleTierChecked: (tier: Tier) => void
	toggleTypeChecked: (type: IntegrationType) => void
}

interface IntegrationsSearchProviderProps {
	children: ReactNode
	integrations: Integration[]
}

export type { IntegrationsSearchContextState, IntegrationsSearchProviderProps }
