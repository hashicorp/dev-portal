/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { createContext, useContext, useMemo } from 'react'
import {
	decodeDelimitedArray,
	encodeDelimitedArray,
	QueryParamOptions,
	useQueryParam,
	withDefault,
} from 'use-query-params'
import {
	Flag,
	Integration,
	IntegrationComponent,
	Tier,
} from 'lib/integrations-api-client/integration'
import { IntegrationsSearchProviderProps } from './types'

/**
 * Uses a comma to delimit entries. e.g. ['a', 'b'] => qp?=a,b
 * https://github.com/pbeshai/use-query-params/blob/master/packages/use-query-params/README.md?plain=1#L374-L380
 */
const CommaArrayParam = {
	encode: (array: string[] | null | undefined) =>
		encodeDelimitedArray(array, ','),

	decode: (arrayStr: string | string[] | null | undefined) =>
		decodeDelimitedArray(arrayStr, ','),
}

export const IntegrationsSearchContext = createContext({
	integrations: [] as Integration[],
	officialChecked: false,
	partnerChecked: false,
	communityChecked: false,
	setOfficialChecked: (bool: boolean) => void 1,
	setPartnerChecked: (bool: boolean) => void 1,
	setCommunityChecked: (bool: boolean) => void 1,
	tierOptions: [] as Tier[],
	matchingOfficial: 0,
	matchingVerified: 0,
	matchingCommunity: 0,
	sortedComponents: [] as $TSFixMe[],
	componentCheckedArray: [] as boolean[],
	setComponentCheckedArray: (val: boolean[]) => void 1,
	flags: [] as Flag[],
	flagsCheckedArray: [] as boolean[],
	setFlagsCheckedArray: (val: boolean[]) => void 1,
	atLeastOneFacetSelected: false,
	filteredIntegrations: [] as Integration[],
})
IntegrationsSearchContext.displayName = 'IntegrationsSearchContext'

export const IntegrationsSearchProvider = ({
	children,
	integrations: _integrations,
}: IntegrationsSearchProviderProps) => {
	const sharedOptions: QueryParamOptions = {
		enableBatching: true,
		updateType: 'replaceIn',
		removeDefaultsFromUrl: true,
	}
	const [qsTiers, setQsTiers] = useQueryParam(
		'tiers',
		withDefault(CommaArrayParam, []),
		sharedOptions
	)

	const [qsComponents, setQsComponents] = useQueryParam(
		'components',
		withDefault(CommaArrayParam, []),
		sharedOptions
	)

	const [qsFlags, setQsFlags] = useQueryParam(
		'flags',
		withDefault(CommaArrayParam, []),
		sharedOptions
	)

	const officialChecked = qsTiers.includes(Tier.OFFICIAL)
	const partnerChecked = qsTiers.includes(Tier.PARTNER)
	const communityChecked = qsTiers.includes(Tier.COMMUNITY)

	const setOfficialChecked = (value: boolean) => {
		if (value) {
			setQsTiers((prev) => [...prev, Tier.OFFICIAL])
		} else {
			setQsTiers((prev) => prev.filter((tier) => tier !== Tier.OFFICIAL))
		}
	}
	const setPartnerChecked = (value: boolean) => {
		if (value) {
			setQsTiers((prev) => [...prev, Tier.PARTNER])
		} else {
			setQsTiers((prev) => prev.filter((tier) => tier !== Tier.PARTNER))
		}
	}
	const setCommunityChecked = (value: boolean) => {
		if (value) {
			setQsTiers((prev) => [...prev, Tier.COMMUNITY])
		} else {
			setQsTiers((prev) => prev.filter((tier) => tier !== Tier.COMMUNITY))
		}
	}

	// Filter out integrations that don't have releases yet
	const integrations = useMemo(() => {
		return _integrations.filter((integration: Integration) => {
			return integration.versions.length > 0
		})
	}, [_integrations])

	const flags: Flag[] = integrations
		// accumulate all integration flags
		.flatMap((e) => e.flags)
		// remove duplicates
		.filter((value, index, self) => {
			const _value = JSON.stringify(value)
			return (
				index ===
				self.findIndex((obj) => {
					return JSON.stringify(obj) === _value
				})
			)
		})

	const flagsCheckedArray = useMemo(() => {
		return flags.map((flag) => {
			return qsFlags.includes(flag.slug)
		})
	}, [flags, qsFlags])

	const setFlagsCheckedArray = (val: boolean[]) => {
		// map [true, false, false, true] => [Flag, Flag]
		const newFlags = val
			.map((checked, index) => {
				if (checked) {
					return flags[index].slug
				}
			})
			.filter(Boolean)

		// update URL & state
		setQsFlags(newFlags)
	}

	let filteredIntegrations = integrations

	// The logical sort ordering of the Tiers
	const tierSortVal = (tier: string): number => {
		switch (tier) {
			case Tier.OFFICIAL:
				return 1
			case Tier.PARTNER:
				return 2
			case Tier.COMMUNITY:
			default:
				return 3
		}
	}

	// Figure out the list of tiers we want to display as filters
	// based off of the integrations list that we are passed. If there
	// are no community integrations passed, we simply won't display
	// that checkbox.
	const tierOptions = Array.from(
		new Set(integrations.map((i: Integration) => i.tier))
	).sort((a: Tier, b: Tier) => {
		if (tierSortVal(a) > tierSortVal(b)) {
			return 1
		} else if (tierSortVal(a) < tierSortVal(b)) {
			return -1
		} else {
			return 0
		}
	})

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

	// Pull out the list of all of the components used by our integrations
	// and sort them alphabetically so they are deterministically ordered.
	const allComponents = filteredIntegrations.flatMap(
		(i: Integration) => i.components
	)

	const mergedComponents = [].concat(allComponents)
	const componentIDs = mergedComponents.map((c) => c.id)
	const dedupedComponents = mergedComponents.filter(
		({ id }, index) => !componentIDs.includes(id, index + 1)
	)

	const sortedComponents = dedupedComponents
		.sort((a, b) => {
			const textA = a.name.toLowerCase()
			const textB = b.name.toLowerCase()
			return textA < textB ? -1 : textA > textB ? 1 : 0
		})
		.map((component) => {
			// Add # of occurances to the component object for facets
			component.occurances = mergedComponents.filter(
				(c) => c.slug === component.slug
			).length
			return component
		})

	// We have to manage our component checked state in a singular
	// state object as there are an unknown number of components.
	const componentCheckedArray = useMemo(() => {
		return sortedComponents.map((component) => {
			return qsComponents.includes(component.slug)
		})
	}, [sortedComponents, qsComponents])
	const setComponentCheckedArray = (val: boolean[]) => {
		// map [true, false, false, true] => [Component, Component]
		const newComponents = val
			.map((checked, index) => {
				if (checked) {
					return sortedComponents[index].slug
				}
			})
			.filter(Boolean)

		// update URL & state
		setQsComponents(newComponents)
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
					const checkedComponent = sortedComponents[index]
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
					const checkedFlag = flags[index]
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
				integrations,
				officialChecked,
				partnerChecked,
				communityChecked,
				setOfficialChecked,
				setPartnerChecked,
				setCommunityChecked,
				tierOptions,
				matchingOfficial,
				matchingVerified,
				matchingCommunity,
				sortedComponents,
				componentCheckedArray,
				setComponentCheckedArray,
				atLeastOneFacetSelected,
				flags,
				flagsCheckedArray,
				setFlagsCheckedArray,
				filteredIntegrations,
			}}
		>
			{children}
		</IntegrationsSearchContext.Provider>
	)
}

export const useIntegrationsSearchContext = () =>
	useContext(IntegrationsSearchContext)
