import {
	Integration,
	Tier,
	IntegrationComponent,
} from 'lib/integrations-api-client/integration'
import { createContext, useState, useContext, useMemo } from 'react'

export const IntegrationsSearchContext = createContext({
	integrations: [] as Integration[],
	officialChecked: false,
	partnerChecked: false,
	communityChecked: false,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setOfficialChecked: (() => {}) as React.Dispatch<
		React.SetStateAction<boolean>
	>,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setPartnerChecked: (() => {}) as React.Dispatch<
		React.SetStateAction<boolean>
	>,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setCommunityChecked: (() => {}) as React.Dispatch<
		React.SetStateAction<boolean>
	>,
	tierOptions: [] as Tier[],
	matchingOfficial: 0,
	matchingVerified: 0,
	matchingCommunity: 0,
	sortedComponents: [] as $TSFixMe[],
	componentCheckedArray: [] as boolean[],
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setComponentCheckedArray: (() => {}) as React.Dispatch<
		React.SetStateAction<boolean[]>
	>,
	atLeastOneFacetSelected: false,
	filteredIntegrations: [] as Integration[],
})

interface Props {
	integrations: Integration[]
}

export const IntegrationsSearchProvider: React.FC<Props> = ({
	children,
	integrations: _integrations,
}) => {
	// Tier Values
	const [officialChecked, setOfficialChecked] = useState(false)
	const [partnerChecked, setPartnerChecked] = useState(false)
	const [communityChecked, setCommunityChecked] = useState(false)

	// Filter out integrations that don't have releases yet
	const integrations = useMemo(() => {
		return _integrations.filter((integration: Integration) => {
			return integration.versions.length > 0
		})
	}, [_integrations])
	// --------------------------------

	let filteredIntegrations = integrations

	// Figure out the list of tiers we want to display as filters
	// based off of the integrations list that we are passed. If there
	// are no community integrations passed, we simply won't display
	// that checkbox.
	const tierOptions = Array.from(
		new Set(integrations.map((i: Integration) => i.tier))
	)

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
	const [componentCheckedArray, setComponentCheckedArray] = useState<boolean[]>(
		new Array(sortedComponents.length).fill(false)
	)

	// Now filter our integrations if facets are selected
	const atLeastOneFacetSelected =
		officialChecked ||
		partnerChecked ||
		communityChecked ||
		componentCheckedArray.includes(true)
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
			return tierMatch && componentMatch
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
				filteredIntegrations,
			}}
		>
			{children}
		</IntegrationsSearchContext.Provider>
	)
}

export const useIntegrationsSearchContext = () =>
	useContext(IntegrationsSearchContext)
