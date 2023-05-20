import {
	IntegrationComponent,
	Flag,
	Tier,
	IntegrationType,
	Integration,
} from 'lib/integrations-api-client/integration'

// Returns logical sort ordering of a Tier
const getTierSortValue = (tier: Tier): number => {
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

interface GetUniqueFacetArraysParams {
	integrations: Integration[]
}

interface GetUniqueFacetArraysResult {
	allComponents: IntegrationComponent[]
	allFlags: Flag[]
	allTiers: Tier[]
	allTypes: IntegrationType[]
}

const getUniqueFacetArrays = ({
	integrations,
}: GetUniqueFacetArraysParams): GetUniqueFacetArraysResult => {
	/**
	 * Get each facet's unique set of values.
	 */
	const componentsById: Record<
		IntegrationComponent['id'],
		IntegrationComponent
	> = {}
	const flagsById: Record<Flag['id'], Flag> = {}
	const tiersSet = new Set<Tier>()
	const typesById = new Set<IntegrationType>()
	integrations.forEach((integration: Integration) => {
		integration.components.forEach((component: IntegrationComponent) => {
			if (!componentsById[component.id]) {
				componentsById[component.id] = component
			}
		})
		integration.flags.forEach((flag: Flag) => {
			if (!flagsById[flag.id]) {
				flagsById[flag.id] = flag
			}
		})
		tiersSet.add(integration.tier)

		const integrationType = integration.integration_type
		if (integrationType && !typesById[integrationType.id]) {
			typesById[integrationType.id] = integrationType
		}
	})

	/**
	 * Create flat, sorted arrays of objects for each facet.
	 *
	 * @TODO is the `occurances` property needed on each `IntegrationComponent`?
	 */

	const allComponents = Object.values(componentsById).sort(
		(a: IntegrationComponent, b: IntegrationComponent) => {
			const aName = a.name.toLowerCase()
			const bName = b.name.toLowerCase()
			if (aName < bName) {
				return -1
			}
			if (aName > bName) {
				return 1
			}
			return 0
		}
	)

	const allFlags = Object.values(flagsById).sort((a: Flag, b: Flag) => {
		const aName = a.name.toLowerCase()
		const bName = b.name.toLowerCase()
		if (aName < bName) {
			return -1
		}
		if (aName > bName) {
			return 1
		}
		return 0
	})

	const allTiers = Array.from(tiersSet).sort((a: Tier, b: Tier) => {
		const aTierSortValue = getTierSortValue(a)
		const bTierSortValue = getTierSortValue(b)
		if (aTierSortValue < bTierSortValue) {
			return -1
		}
		if (aTierSortValue > bTierSortValue) {
			return 1
		}
		return 0
	})

	// @TODO should these be sorted? Not currently done in prod
	const allTypes = Object.values(typesById).sort(
		(a: IntegrationType, b: IntegrationType) => {
			const aName = a.plural_name.toLowerCase()
			const bName = b.plural_name.toLowerCase()
			if (aName < bName) {
				return -1
			}
			if (aName > bName) {
				return 1
			}
			return 0
		}
	)

	return {
		allComponents,
		allFlags,
		allTiers,
		allTypes,
	}
}

export type { GetUniqueFacetArraysResult }
export { getUniqueFacetArrays }
