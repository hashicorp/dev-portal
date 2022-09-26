import { CheckboxField } from 'components/form/field-controls'
import { FilterSection } from '../filter-section'

interface ResourceFilter {
	attribute: string
	refine: (value: { isRefined?: boolean }) => void
	value: {
		isRefined: boolean
	}
	label: string
}

export interface ResourcesFilterProps {
	resources: ResourceFilter[]
}

function ToggleRefinement({ refine, value, label }) {
	const inputId = `filter-${label}`

	return (
		<CheckboxField
			id={inputId}
			checked={value.isRefined}
			onChange={() => {
				refine({ isRefined: value.isRefined })
			}}
			label={label}
			labelFontWeight="regular"
		/>
	)
}

export function ResourcesFilter({ resources }: ResourcesFilterProps) {
	return (
		<FilterSection label="Resources">
			{resources.map((attribute) => (
				<ToggleRefinement key={attribute.attribute} {...attribute} />
			))}
		</FilterSection>
	)
}
