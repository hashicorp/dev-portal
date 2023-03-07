/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { createContext, useContext, useMemo } from 'react'
import {
	NumberParam,
	StringParam,
	useQueryParams,
	withDefault,
} from 'use-query-params'
import capitalize from '@hashicorp/platform-util/text/capitalize'
import {
	Flag,
	Integration,
	IntegrationComponent,
	Tier,
} from 'lib/integrations-api-client/integration'
import { IntegrationsSearchProviderProps } from './types'
import { CommaArrayParam } from './constants'
import { integrationLibraryFilterSelectedEvent } from 'views/product-integrations-landing/components/searchable-integrations-list/helpers/analytics'

interface FacetFilterOption {
	id: string
	label: string
	onChange: () => void
	selected: boolean
}

export const IntegrationsSearchContext = createContext({
	atLeastOneFacetSelected: false,
	clearFilters: () => void 1,
	componentOptions: [] as FacetFilterOption[],
	filteredIntegrations: [] as Integration[],
	filterQuery: '',
	flagOptions: [] as FacetFilterOption[],
	integrations: [] as Integration[],
	page: 1,
	pageSize: 8,
	resetPage: () => void 1,
	setFilterQuery: (newValue: string) => void 1,
	setPage: (newValue: number) => void 1,
	setPageSize: (newValue: number) => void 1,
	tierOptions: [] as FacetFilterOption[],
})
IntegrationsSearchContext.displayName = 'IntegrationsSearchContext'

export const IntegrationsSearchProvider = ({
	allComponents,
	allFlags,
	allTiers,
	children,
	integrations: _integrations,
}: IntegrationsSearchProviderProps) => {
	const [queryParams, setQueryParams] = useQueryParams(
		{
			components: withDefault(CommaArrayParam, []),
			flags: withDefault(CommaArrayParam, []),
			filterQuery: withDefault(StringParam, ''),
			page: withDefault(NumberParam, 1),
			pageSize: withDefault(NumberParam, 8),
			tiers: withDefault(CommaArrayParam, []),
		},
		{
			enableBatching: true,
			removeDefaultsFromUrl: true,
			updateType: 'replaceIn',
		}
	)
	const {
		components: qsComponents,
		flags: qsFlags,
		filterQuery,
		page,
		pageSize,
		tiers: qsTiers,
	} = queryParams

	const {
		clearFilters,
		resetPage,
		setFilterQuery,
		setPage,
		setPageSize,
		toggleComponentChecked,
		toggleFlagChecked,
		toggleTierChecked,
	} = useMemo(() => {
		return {
			clearFilters: () => {
				setQueryParams({
					components: [],
					filterQuery: '',
					flags: [],
					page: 1,
					// @ TODO should we also reset pageSize?
					// pageSize: 8,
					tiers: [],
				})
			},
			setFilterQuery: (newValue: string) => {
				setQueryParams({ filterQuery: newValue })
			},
			resetPage: () => {
				setQueryParams({ page: 1 })
			},
			setPage: (newValue: number) => {
				setQueryParams({ page: newValue })
			},
			setPageSize: (newValue: number) => {
				setQueryParams({ pageSize: newValue })
			},
			toggleComponentChecked: (component: IntegrationComponent) => {
				setQueryParams((prev: $TSFixMe) => {
					const isChecked = prev.components.includes(component.slug)
					if (isChecked) {
						return {
							...prev,
							components: prev.components.filter(
								(slug: IntegrationComponent['slug']) => slug !== component.slug
							),
						}
					} else {
						integrationLibraryFilterSelectedEvent({
							filter_category: 'component',
							filter_value: component.slug,
						})
						return {
							...prev,
							components: [...prev.components, component.slug],
						}
					}
				})
			},
			toggleFlagChecked: (flag: Flag) => {
				setQueryParams((prev: $TSFixMe) => {
					const isChecked = prev.flags.includes(flag.slug)
					if (isChecked) {
						return {
							...prev,
							flags: prev.flags.filter(
								(slug: Flag['slug']) => slug != flag.slug
							),
						}
					} else {
						integrationLibraryFilterSelectedEvent({
							filter_category: 'flag',
							filter_value: flag.slug,
						})
						return {
							...prev,
							tiers: [...prev.tiers, flag.slug],
						}
					}
				})
			},
			toggleTierChecked: (tier: Tier) => {
				setQueryParams((prev: $TSFixMe) => {
					const isChecked = prev.tiers.includes(tier)
					if (isChecked) {
						return {
							...prev,
							tiers: prev.tiers.filter((_tier: Tier) => _tier !== tier),
						}
					} else {
						integrationLibraryFilterSelectedEvent({
							filter_category: 'tier',
							filter_value: tier,
						})
						return {
							...prev,
							tiers: [...prev.tiers, tier],
						}
					}
				})
			},
		}
	}, [setQueryParams])

	// Filter out integrations that don't have releases yet
	const integrations = useMemo(() => {
		return _integrations.filter((integration: Integration) => {
			return integration.versions.length > 0
		})
	}, [_integrations])

	const { atLeastOneFacetSelected, filteredIntegrations } = useMemo(() => {
		let filteredIntegrations = integrations

		const atLeastOneFacetSelected =
			qsComponents.length > 0 || qsFlags.length > 0 || qsTiers.length > 0
		if (atLeastOneFacetSelected) {
			filteredIntegrations = integrations.filter((integration: Integration) => {
				let tierMatch = true
				if (qsTiers.length > 0) {
					tierMatch = qsTiers.includes(integration.tier)
				}

				let componentMatch = true
				if (qsComponents.length > 0) {
					componentMatch = integration.components.some(
						(component: IntegrationComponent) => {
							return qsComponents.includes(component.slug)
						}
					)
				}

				let flagMatch = true
				if (qsFlags.length > 0) {
					flagMatch = integration.flags.some((flag: Flag) => {
						return qsFlags.includes(flag.slug)
					})
				}

				return tierMatch && componentMatch && flagMatch
			})
		}

		return {
			atLeastOneFacetSelected,
			filteredIntegrations,
		}
	}, [integrations, qsComponents, qsFlags, qsTiers])

	const componentOptions = useMemo(() => {
		return allComponents.map((component: IntegrationComponent) => {
			return {
				id: component.slug,
				label: capitalize(component.plural_name),
				onChange: () => {
					resetPage()
					toggleComponentChecked(component)
				},
				selected: qsComponents.includes(component.slug),
			}
		})
	}, [allComponents, qsComponents, resetPage, toggleComponentChecked])

	const flagOptions = useMemo(() => {
		return allFlags.map((flag: Flag) => {
			return {
				id: flag.slug,
				label: flag.name,
				onChange: () => {
					resetPage()
					toggleFlagChecked(flag)
				},
				selected: qsFlags.includes(flag.slug),
			}
		})
	}, [allFlags, qsFlags, resetPage, toggleFlagChecked])

	const tierOptions = useMemo(() => {
		return allTiers.map((tier: Tier) => {
			return {
				id: tier,
				label: capitalize(tier),
				onChange: () => {
					resetPage()
					toggleTierChecked(tier)
				},
				selected: qsTiers.includes(tier),
			}
		})
	}, [allTiers, qsTiers, resetPage, toggleTierChecked])

	return (
		<IntegrationsSearchContext.Provider
			value={{
				atLeastOneFacetSelected,
				clearFilters,
				componentOptions,
				filteredIntegrations,
				filterQuery,
				flagOptions,
				integrations,
				page,
				pageSize,
				resetPage,
				setFilterQuery,
				setPage,
				setPageSize,
				tierOptions,
			}}
		>
			{children}
		</IntegrationsSearchContext.Provider>
	)
}

export const useIntegrationsSearchContext = () =>
	useContext(IntegrationsSearchContext)
