/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { createContext, useContext, useMemo } from 'react'
import { useQueryParams, withDefault } from 'use-query-params'
import {
	Flag,
	Integration,
	IntegrationComponent,
	Tier,
} from 'lib/integrations-api-client/integration'
import { IntegrationsSearchProviderProps } from './types'
import { CommaArrayParam } from './constants'
import { integrationLibraryFilterSelectedEvent } from 'views/product-integrations-landing/components/searchable-integrations-list/helpers/analytics'

export const IntegrationsSearchContext = createContext({
	allComponents: [] as IntegrationComponent[],
	allFlags: [] as Flag[],
	allTiers: [] as Tier[],
	atLeastOneFacetSelected: false,
	clearFilters: () => void 1,
	communityChecked: false,
	componentCheckedArray: [] as boolean[],
	filteredIntegrations: [] as Integration[],
	flagsCheckedArray: [] as boolean[],
	integrations: [] as Integration[],
	matchingCommunity: 0,
	matchingOfficial: 0,
	matchingVerified: 0,
	officialChecked: false,
	partnerChecked: false,
	setComponentCheckedArray: (val: boolean[]) => void 1,
	setFlagsCheckedArray: (val: boolean[]) => void 1,
	toggleTierChecked: (tier: Tier) => void 1,
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
			tiers: withDefault(CommaArrayParam, []),
		},
		{
			enableBatching: true,
			removeDefaultsFromUrl: true,
			updateType: 'replaceIn',
		}
	)
	const {
		tiers: qsTiers,
		components: qsComponents,
		flags: qsFlags,
	} = queryParams

	const { clearFilters, toggleTierChecked } = useMemo(() => {
		return {
			clearFilters: () => {
				setQueryParams({ components: [], flags: [], tiers: [] })
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

	const officialChecked = qsTiers.includes(Tier.OFFICIAL)
	const partnerChecked = qsTiers.includes(Tier.PARTNER)
	const communityChecked = qsTiers.includes(Tier.COMMUNITY)

	// Filter out integrations that don't have releases yet
	const integrations = useMemo(() => {
		return _integrations.filter((integration: Integration) => {
			return integration.versions.length > 0
		})
	}, [_integrations])

	const flagsCheckedArray = useMemo(() => {
		return allFlags.map((flag: Flag) => {
			return qsFlags.includes(flag.slug)
		})
	}, [allFlags, qsFlags])

	const setFlagsCheckedArray = (val: boolean[]) => {
		// map [true, false, false, true] => [Flag, Flag]
		const newFlags = val
			.map((checked, index) => {
				if (checked) {
					return allFlags[index].slug
				}
			})
			.filter(Boolean)

		// update URL & state
		setQueryParams({ flags: newFlags })
	}

	let filteredIntegrations = integrations

	// Calculate the number of integrations that match each tier
	const matchingOfficial = integrations.filter(
		(i) => i.tier === Tier.OFFICIAL
	).length
	const matchingVerified = integrations.filter(
		(i) => i.tier === Tier.PARTNER
	).length
	const matchingCommunity = integrations.filter(
		(i) => i.tier === Tier.COMMUNITY
	).length

	// We have to manage our component checked state in a singular
	// state object as there are an unknown number of components.
	const componentCheckedArray = useMemo(() => {
		return allComponents.map((component) => {
			return qsComponents.includes(component.slug)
		})
	}, [allComponents, qsComponents])
	const setComponentCheckedArray = (val: boolean[]) => {
		// map [true, false, false, true] => [Component, Component]
		const newComponents = val
			.map((checked, index) => {
				if (checked) {
					return allComponents[index].slug
				}
			})
			.filter(Boolean)

		// update URL & state
		setQueryParams({ components: newComponents })
	}

	// Now filter our integrations if facets are selected
	const atLeastOneFacetSelected =
		officialChecked ||
		partnerChecked ||
		communityChecked ||
		componentCheckedArray.includes(true) ||
		flagsCheckedArray.includes(true)

	if (atLeastOneFacetSelected) {
		filteredIntegrations = integrations.filter((integration: Integration) => {
			// Default tierMatch to true if nothing is checked, false otherwise
			let tierMatch: boolean =
				!officialChecked && !partnerChecked && !communityChecked
			if (officialChecked && integration.tier === Tier.OFFICIAL) {
				tierMatch = true
			}
			if (partnerChecked && integration.tier === Tier.PARTNER) {
				tierMatch = true
			}
			if (communityChecked && integration.tier === Tier.COMMUNITY) {
				tierMatch = true
			}

			// Loop over each component to see if they match any checked components
			// If there are no components selected, default this to true
			let componentMatch = !componentCheckedArray.includes(true)
			componentCheckedArray.forEach((checked, index) => {
				if (checked) {
					const checkedComponent = allComponents[index]
					// Check each integration component
					integration.components.forEach((component: IntegrationComponent) => {
						if (component.slug === checkedComponent.slug) {
							componentMatch = true
						}
					})
				}
			})

			// If no flags are selected, do not filter by flag
			let flagMatch = !flagsCheckedArray.includes(true)
			// For each checked flag, loop over each integration's list of flags
			// and return true if at least 1 flag matches
			flagsCheckedArray.forEach((checked, index) => {
				if (checked) {
					const checkedFlag = allFlags[index]
					integration.flags.forEach((flag: Flag) => {
						if (flag.slug === checkedFlag.slug) {
							flagMatch = true
						}
					})
				}
			})

			return tierMatch && componentMatch && flagMatch
		})
	}

	return (
		<IntegrationsSearchContext.Provider
			value={{
				allComponents,
				allFlags,
				allTiers,
				atLeastOneFacetSelected,
				clearFilters,
				communityChecked,
				componentCheckedArray,
				filteredIntegrations,
				flagsCheckedArray,
				integrations,
				matchingCommunity,
				matchingOfficial,
				matchingVerified,
				officialChecked,
				partnerChecked,
				setComponentCheckedArray,
				setFlagsCheckedArray,
				toggleTierChecked,
			}}
		>
			{children}
		</IntegrationsSearchContext.Provider>
	)
}

export const useIntegrationsSearchContext = () =>
	useContext(IntegrationsSearchContext)
