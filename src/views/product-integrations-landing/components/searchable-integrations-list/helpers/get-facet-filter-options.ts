import capitalize from '@hashicorp/platform-util/text/capitalize'
import {
	Flag,
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

const getFacetFilterOptions = ({
	allComponents,
	allFlags,
	allTiers,
	allTypes,
	queryParams,
	resetPage,
	toggleComponentChecked,
	toggleFlagChecked,
	toggleTierChecked,
	toggleTypeChecked,
}: $TSFixMe): {
	componentOptions: FacetFilterOption[]
	flagOptions: FacetFilterOption[]
	tierOptions: FacetFilterOption[]
	typeOptions: FacetFilterOption[]
} => {
	const componentOptions = allComponents.map(
		(component: IntegrationComponent) => {
			return {
				id: component.slug,
				label: capitalize(component.plural_name),
				onChange: () => {
					resetPage()
					toggleComponentChecked(component)
				},
				selected: queryParams.components.includes(component.slug),
			}
		}
	)

	const flagOptions = allFlags.map((flag: Flag) => {
		return {
			id: flag.slug,
			label: flag.name,
			onChange: () => {
				resetPage()
				toggleFlagChecked(flag)
			},
			selected: queryParams.flags.includes(flag.slug),
		}
	})

	const tierOptions = allTiers.map((tier: Tier) => {
		return {
			id: tier,
			label: capitalize(tier),
			onChange: () => {
				resetPage()
				toggleTierChecked(tier)
			},
			selected: queryParams.tiers.includes(tier),
		}
	})

	const typeOptions = allTypes.map((type: IntegrationType) => {
		return {
			id: type.slug,
			label: type.plural_name,
			onChange: () => {
				resetPage()
				toggleTypeChecked(type)
			},
			selected: queryParams.types.includes(type.slug),
		}
	})

	return {
		componentOptions,
		flagOptions,
		tierOptions,
		typeOptions,
	}
}

export type { FacetFilterOption }
export { getFacetFilterOptions }
