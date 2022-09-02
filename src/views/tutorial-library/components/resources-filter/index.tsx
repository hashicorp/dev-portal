import { CheckboxField } from 'components/form/field-controls'
import { FilterSection } from '../filter-section'

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

export function ResourcesFilter({ resources }) {
	return (
		<FilterSection heading="Resources">
			{resources.map((attribute) => (
				<li key={attribute.attribute}>
					<ToggleRefinement {...attribute} />
				</li>
			))}
		</FilterSection>
	)
}
