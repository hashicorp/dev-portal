/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { createContext, useContext, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useQueryParams } from 'use-query-params'
import capitalize from '@hashicorp/platform-util/text/capitalize'
import {
	Flag,
	Integration,
	IntegrationComponent,
	Tier,
} from 'lib/integrations-api-client/integration'
import { integrationLibraryFilterSelectedEvent } from 'views/product-integrations-landing/components/searchable-integrations-list/helpers/analytics'
import { getDoesMatchFilterQuery } from 'views/product-integrations-landing/components/searchable-integrations-list/helpers/get-filtered-integrations'
import {
	IntegrationsSearchContextState,
	IntegrationsSearchProviderProps,
} from './types'
import {
	DEFAULT_PAGE_SIZE_VALUE,
	DEFAULT_PAGE_VALUE,
	USE_QUERY_PARAMS_CONFIG_MAP,
	USE_QUERY_PARAMS_OPTIONS,
} from './constants'
import { coerceToDefaultValue } from './helpers'

export const IntegrationsSearchContext =
	createContext<IntegrationsSearchContextState>(undefined)
IntegrationsSearchContext.displayName = 'IntegrationsSearchContext'

export const IntegrationsSearchProvider = ({
	allComponents,
	allFlags,
	allTiers,
	children,
	integrations,
}: IntegrationsSearchProviderProps) => {
	const router = useRouter()
	const hasFilteredAfterRouterReady = useRef(false)
	const [isLoading, setIsLoading] = useState(true)

	const [queryParams, setQueryParams] = useQueryParams(
		USE_QUERY_PARAMS_CONFIG_MAP,
		USE_QUERY_PARAMS_OPTIONS
	)
	const page = coerceToDefaultValue(queryParams.page, DEFAULT_PAGE_VALUE)
	const pageSize = coerceToDefaultValue(
		queryParams.pageSize,
		DEFAULT_PAGE_SIZE_VALUE
	)

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
					flags: [],
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
							flags: [...prev.flags, flag.slug],
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

	const {
		atLeastOneFacetSelected,
		filteredIntegrations,
		paginatedIntegrations,
	} = useMemo(() => {
		if (!router.isReady) {
			return {
				atLeastOneFacetSelected: false,
				filteredIntegrations: [],
				paginatedIntegrations: [],
			}
		}

		const atLeastOneFacetSelected =
			queryParams.components.length > 0 ||
			queryParams.flags.length > 0 ||
			queryParams.tiers.length > 0

		/**
		 * First, filter by facet and filterQuery
		 */
		const filteredIntegrations = integrations.filter(
			(integration: Integration) => {
				let tierMatch = true
				if (queryParams.tiers.length > 0) {
					tierMatch = queryParams.tiers.includes(integration.tier)
				}

				let componentMatch = true
				if (queryParams.components.length > 0) {
					componentMatch = integration.components.some(
						(component: IntegrationComponent) => {
							return queryParams.components.includes(component.slug)
						}
					)
				}

				let flagMatch = true
				if (queryParams.flags.length > 0) {
					flagMatch = integration.flags.some((flag: Flag) => {
						return queryParams.flags.includes(flag.slug)
					})
				}

				let filterQueryMatch = true
				if (queryParams.filterQuery.length) {
					filterQueryMatch = getDoesMatchFilterQuery({
						integration,
						filterQuery: queryParams.filterQuery,
					})
				}

				return tierMatch && componentMatch && flagMatch && filterQueryMatch
			}
		)

		/**
		 * Second, paginate the filtered list
		 */
		const paginatedIntegrations = filteredIntegrations.slice(
			(page - 1) * pageSize,
			page * pageSize
		)

		/**
		 * Third, update the `hasFilteredAfterRouterReady` ref to indicate that
		 * filtering has been completed.
		 */
		if (hasFilteredAfterRouterReady.current === false) {
			hasFilteredAfterRouterReady.current = true
		}

		/**
		 * Lastly, return the data as a neatly packaged object.
		 */
		return {
			atLeastOneFacetSelected,
			filteredIntegrations,
			paginatedIntegrations,
		}
	}, [integrations, page, pageSize, queryParams, router.isReady])

	/**
	 * Generate the options arrays for UI elements.
	 *
	 * @TODO move this to the component that actually renders UI?
	 */
	const { componentOptions, flagOptions, tierOptions } = useMemo(() => {
		return {
			componentOptions: allComponents.map((component: IntegrationComponent) => {
				return {
					id: component.slug,
					label: capitalize(component.plural_name),
					onChange: () => {
						resetPage()
						toggleComponentChecked(component)
					},
					selected: queryParams.components.includes(component.slug),
				}
			}),
			flagOptions: allFlags.map((flag: Flag) => {
				return {
					id: flag.slug,
					label: flag.name,
					onChange: () => {
						resetPage()
						toggleFlagChecked(flag)
					},
					selected: queryParams.flags.includes(flag.slug),
				}
			}),
			tierOptions: allTiers.map((tier: Tier) => {
				return {
					id: tier,
					label: capitalize(tier),
					onChange: () => {
						resetPage()
						toggleTierChecked(tier)
					},
					selected: queryParams.tiers.includes(tier),
				}
			}),
		}
	}, [
		allComponents,
		allFlags,
		allTiers,
		queryParams,
		resetPage,
		toggleComponentChecked,
		toggleFlagChecked,
		toggleTierChecked,
	])

	/**
	 * If `isLoading` hasn't already been updated, and it's ready to be updated,
	 * update it after a 1.5 second delay. The purpose of the delay is to
	 */
	if (
		isLoading === true &&
		router.isReady &&
		hasFilteredAfterRouterReady.current === true
	) {
		setIsLoading(false)
	}

	return (
		<IntegrationsSearchContext.Provider
			value={{
				atLeastOneFacetSelected,
				clearFilters,
				componentOptions,
				filteredIntegrations,
				filterQuery: queryParams.filterQuery,
				flagOptions,
				integrations,
				isLoading,
				page,
				pageSize,
				paginatedIntegrations,
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
