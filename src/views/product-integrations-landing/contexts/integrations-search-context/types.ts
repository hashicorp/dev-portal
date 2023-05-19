import { type ReactNode } from 'react'
import {
	Flag,
	Integration,
	IntegrationComponent,
	IntegrationType,
	Tier,
} from 'lib/integrations-api-client/integration'

interface FacetFilterOption {
	id: string
	label: string
	onChange: () => void
	selected: boolean
}

interface IntegrationsSearchContextState {
	atLeastOneFacetSelected: boolean
	clearFilters: () => void
	componentOptions: FacetFilterOption[]
	filteredIntegrations: Integration[]
	filterQuery: string
	flagOptions: FacetFilterOption[]
	integrations: Integration[]
	isLoading: boolean
	page: number
	pageSize: number
	paginatedIntegrations: Integration[]
	resetPage: () => void
	setFilterQuery: (newValue: string) => void
	setPage: (newValue: number) => void
	setPageSize: (newValue: number) => void
	tierOptions: FacetFilterOption[]
	typeOptions: FacetFilterOption[]
}

interface IntegrationsSearchProviderProps {
	allComponents: IntegrationComponent[]
	allFlags: Flag[]
	allTiers: Tier[]
	allTypes: IntegrationType[]
	children: ReactNode
	integrations: Integration[]
}

export type {
	FacetFilterOption,
	IntegrationsSearchContextState,
	IntegrationsSearchProviderProps,
}
