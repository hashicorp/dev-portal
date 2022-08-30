import { RadioField } from 'components/form/field-controls'
import { useInstantSearch, useMenu } from 'react-instantsearch-hooks-web'
import { EDITIONS } from '../../constants'
import { FilterSection } from '../filter-section'

export function EditionFilter() {
	const { refine } = useMenu({ attribute: 'edition' })

	const { indexUiState } = useInstantSearch()
	const selectedAddition = indexUiState?.menu?.edition

	const isAnyEditionSelected = selectedAddition !== undefined

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
				const isEditionSelected = value === selectedAddition

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
