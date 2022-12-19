import { RadioField } from 'components/form/field-controls'
import { EDITIONS } from '../../constants'
import { FilterSection } from '../filter-section'

export interface EditionFilterProps {
	refine: (value: string | null) => void
	selectedEdition: string
}

export function EditionFilter({ refine, selectedEdition }: EditionFilterProps) {
	const isAnyEditionSelected = selectedEdition !== undefined

	return (
		<FilterSection label="Edition">
			<RadioField
				labelFontWeight="regular"
				label="All"
				value="all"
				name="edition"
				id="all"
				checked={!isAnyEditionSelected}
				onChange={() => refine(null)}
			/>
			{EDITIONS.map(({ value, label }) => {
				const isEditionSelected = value === selectedEdition

				const inputId = `filter-${value}`

				return (
					<RadioField
						key={value}
						labelFontWeight="regular"
						label={label}
						value={value}
						name="edition"
						id={inputId}
						checked={isEditionSelected}
						onChange={() => refine(value)}
					/>
				)
			})}
		</FilterSection>
	)
}
