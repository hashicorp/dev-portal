import { CheckboxField } from 'components/form/field-controls'
import { useToggleRefinement } from 'react-instantsearch-hooks-web'
import { RESOURCES } from '../../constants'
import { FilterSection } from '../filter-section'

function ToggleRefinement({ attribute, label }) {
	const { value, refine } = useToggleRefinement({ attribute })

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

export function ResourcesFilter() {
	return (
		<FilterSection heading="Resources">
			{RESOURCES.map((attribute) => (
				<li key={attribute.attribute}>
					<ToggleRefinement {...attribute} />
				</li>
			))}
		</FilterSection>
	)
}
