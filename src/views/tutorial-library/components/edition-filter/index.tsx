import { useInstantSearch, useMenu } from 'react-instantsearch-hooks-web'
import { EDITIONS } from '../../constants'
import { FilterSection } from '../filter-section'

/**
 * @TODO abstract the radio input to reduce duplication here
 */
export function EditionFilter() {
	const { refine } = useMenu({ attribute: 'edition' })

	const { indexUiState } = useInstantSearch()
	const selectedAddition = indexUiState?.menu?.edition

	const isAnyEditionSelected = selectedAddition !== undefined

	return (
		<FilterSection heading="Edition">
			<li>
				<label htmlFor="all">
					<input
						type="radio"
						radioGroup="edition"
						id={'all'}
						checked={!isAnyEditionSelected}
						onChange={() => refine(null)}
					/>
					<span>All</span>
				</label>
			</li>
			{EDITIONS.map(({ value, label }) => {
				const isEditionSelected = value === selectedAddition

				const inputId = `filter-${value}`

				return (
					<li key={value}>
						<label htmlFor={inputId}>
							<input
								type="radio"
								radioGroup="edition"
								id={inputId}
								checked={isEditionSelected}
								onChange={() => refine(value)}
							/>
							<span>{label}</span>
						</label>
					</li>
				)
			})}
		</FilterSection>
	)
}
