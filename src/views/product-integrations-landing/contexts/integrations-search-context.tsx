/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	Flag,
	Integration,
	IntegrationComponent,
	IntegrationType,
	Tier,
} from 'lib/integrations-api-client/integration'
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { QueryParamOptions, useQueryParam, withDefault } from 'use-query-params'

import { decodeDelimitedArray, encodeDelimitedArray } from 'use-query-params'

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
	tierOptions: [] as Tier[],
	tiersCheckedArray: [] as boolean[],
	setTiersCheckedArray: (val: boolean[]) => void 1,
	sortedComponents: [] as $TSFixMe[],
	componentCheckedArray: [] as boolean[],
	setComponentCheckedArray: (val: boolean[]) => void 1,
	flags: [] as Flag[],
	flagsCheckedArray: [] as boolean[],
	setFlagsCheckedArray: (val: boolean[]) => void 1,
	types: [] as IntegrationType[],
	typesCheckedArray: [] as boolean[],
	setTypesCheckedArray: (val: boolean[]) => void 1,
	atLeastOneFacetSelected: false,
	filteredIntegrations: [] as Integration[],
})

interface Props {
	integrations: Integration[]
	children: ReactNode
}

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

export const IntegrationsSearchProvider = ({
	children,
	integrations: _integrations,
}: Props) => {
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

	const [qsTypes, setQsTypes] = useQueryParam(
		'types',
		withDefault(CommaArrayParam, []),
		sharedOptions
	)

	// Filter out integrations that don't have releases yet
	const integrations = useMemo(() => {
		return _integrations.filter((integration: Integration) => {
			return integration.versions.length > 0
		})
	}, [_integrations])

	// accumulate all unique filterable integration fields
	// - tiers
	// - components
	// - flags
	// - types
	const { tiers, components, flags, types } = integrations.reduce(
		(acc, next) => {
			// collect tiers
			if (!acc.tiers.some((e) => e == next.tier)) {
				acc.tiers = acc.tiers.concat(next.tier)
				acc.tiers = acc.tiers.sort((a: Tier, b: Tier) => {
					if (tierSortVal(a) > tierSortVal(b)) {
						return 1
					} else if (tierSortVal(a) < tierSortVal(b)) {
						return -1
					} else {
						return 0
					}
				})
			}
			// collect components
			next.components.forEach((component) => {
				if (!acc.components.some((e) => e.id == component.id)) {
					acc.components = acc.components.concat(component).sort((a, b) => {
						const textA = a.name.toLowerCase()
						const textB = b.name.toLowerCase()
						return textA < textB ? -1 : textA > textB ? 1 : 0
					})
				}
			})
			// collect flags
			next.flags.forEach((flag) => {
				if (!acc.flags.some((e) => e.id == flag.id)) {
					acc.flags = acc.flags.concat(flag)
				}
			})
			// collect types
			if (next.integration_type) {
				if (!acc.types.some((e) => e.id == next.integration_type.id)) {
					acc.types = acc.types.concat(next.integration_type)
				}
			}
			return acc
		},
		{
			tiers: [] as Tier[],
			components: [] as IntegrationComponent[],
			flags: [] as Flag[],
			types: [] as IntegrationType[],
		}
	)

	const tiersCheckedArray = useMemo(() => {
		return tiers.map((tier) => {
			return qsTiers.includes(tier)
		})
	}, [tiers, qsTiers])

	const setTiersCheckedArray = (val: boolean[]) => {
		// map [true, false, false, true] => [Tier, Tier]
		const newTiers = val
			.map((checked, index) => {
				if (checked) {
					return tiers[index]
				}
			})
			.filter(Boolean)

		// update URL & state
		setQsTiers(newTiers)
	}

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

	// We have to manage our component checked state in a singular
	// state object as there are an unknown number of components.
	const componentCheckedArray = useMemo(() => {
		return components.map((component) => {
			return qsComponents.includes(component.slug)
		})
	}, [components, qsComponents])
	const setComponentCheckedArray = (val: boolean[]) => {
		// map [true, false, false, true] => [Component, Component]
		const newComponents = val
			.map((checked, index) => {
				if (checked) {
					return components[index].slug
				}
			})
			.filter(Boolean)

		// update URL & state
		setQsComponents(newComponents)
	}

	const typesCheckedArray = useMemo(() => {
		return types.map((type) => {
			return qsTypes.includes(type.slug)
		})
	}, [types, qsTypes])

	const setTypesCheckedArray = (val: boolean[]) => {
		// map [true, false, false, true] => [Type, Type]
		const newTypes = val
			.map((checked, index) => {
				if (checked) {
					return types[index].slug
				}
			})
			.filter(Boolean)
		// update URL & state
		setQsTypes(newTypes)
	}

	// Now filter our integrations if facets are selected
	const atLeastOneFacetSelected =
		tiersCheckedArray.includes(true) ||
		componentCheckedArray.includes(true) ||
		flagsCheckedArray.includes(true) ||
		typesCheckedArray.includes(true)

	let filteredIntegrations = integrations
	if (atLeastOneFacetSelected) {
		filteredIntegrations = integrations.filter((integration: Integration) => {
			// Default tierMatch to true if nothing is checked, false otherwise
			let tierMatch = !tiersCheckedArray.includes(true)
			tiersCheckedArray.forEach((checked, index) => {
				if (checked) {
					const checkedTier = tiers[index]
					if (integration.tier === checkedTier) {
						tierMatch = true
					}
				}
			})

			// Loop over each component to see if they match any checked components
			// If there are no components selected, default this to true
			let componentMatch = !componentCheckedArray.includes(true)
			componentCheckedArray.forEach((checked, index) => {
				if (checked) {
					const checkedComponent = components[index]
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

			// If no types are selected, do not filter by type
			let typeMatch = !typesCheckedArray.includes(true)
			typesCheckedArray.forEach((checked, index) => {
				// set typeMatch to true if the integrations type is selected
				if (checked) {
					const checkedType = types[index]
					if (integration.integration_type.slug === checkedType.slug) {
						typeMatch = true
					}
				}
			})

			return tierMatch && componentMatch && flagMatch && typeMatch
		})
	}

	return (
		<IntegrationsSearchContext.Provider
			value={{
				integrations,
				tierOptions: tiers,
				tiersCheckedArray,
				setTiersCheckedArray,
				sortedComponents: components,
				componentCheckedArray,
				setComponentCheckedArray,
				atLeastOneFacetSelected,
				flags,
				flagsCheckedArray,
				setFlagsCheckedArray,
				types,
				typesCheckedArray,
				setTypesCheckedArray,
				filteredIntegrations,
			}}
		>
			{children}
		</IntegrationsSearchContext.Provider>
	)
}

export const useIntegrationsSearchContext = () =>
	useContext(IntegrationsSearchContext)
