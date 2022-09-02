import { RadioField } from 'components/form/field-controls'
import { EDITIONS } from '../../constants'
import { FilterSection } from '../filter-section'

export function EditionFilter({ refine, selectedEdition }) {
	const isAnyEditionSelected = selectedEdition !== undefined

	return (
		<FilterSection heading="Edition">
			<li>
				<RadioField
					labelFontWeight="regular"
					label="All"
					value="all"
					name="edition"
					id="all"
					checked={!isAnyEditionSelected}
					onChange={() => refine(null)}
				/>
			</li>
			{EDITIONS.map(({ value, label }) => {
				const isEditionSelected = value === selectedEdition

				const inputId = `filter-${value}`

				return (
					<li key={value}>
						<RadioField
							labelFontWeight="regular"
							label={label}
							value={value}
							name="edition"
							id={inputId}
							checked={isEditionSelected}
							onChange={() => refine(value)}
						/>
					</li>
				)
			})}
		</FilterSection>
	)
}
