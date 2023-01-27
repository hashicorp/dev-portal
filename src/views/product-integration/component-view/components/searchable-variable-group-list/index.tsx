import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import FilterInput from 'components/filter-input'
import { CheckboxField } from 'components/form/field-controls'
import { useState } from 'react'
import { Variable, VariableGroupList } from '../variable-group-list'
import {
	applyQueryFilter,
	applyRequiredFilter,
	includeMatchAncestors,
} from './helpers'
import s from './style.module.css'

interface SearchableVariableGroupListProps {
	groupName: string
	variables: Array<Variable>
}

export default function SearchableVariableGroupList({
	groupName,
	variables,
}: SearchableVariableGroupListProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [requiredOnly, setRequiredOnly] = useState(false)

	/**
	 * We only want to render the `requiredOnly` filtering input if the
	 * required property is relevant for the variables we're rendering.
	 *
	 * We consider the required property to be relevant if any of the variables
	 * have their required property set to `true` or `false`, rather than
	 * the default `null` setting.
	 */
	const isRequiredRelevant = variables.find(
		({ required }: Variable) => required === true || required === false
	)

	/**
	 * Apply the requiredOnly & searchQuery filters.
	 * Then, include ancestor variables for all direct matches.
	 *
	 * Note: We do not include unmatched ancestor variables in the results count.
	 * Instead, we display the results count as the number of direct matches only.
	 * As well, we only highlight direct matches, and only if filters are applied.
	 */
	let matches = variables
	// Apply the required filter, if applicable
	const applyRequired = requiredOnly === true
	if (applyRequired) {
		matches = applyRequiredFilter(matches)
	}
	// Apply the query filter, if applicable. Query matches are highlighted.
	const applyQuery = searchQuery.length > 2
	if (applyQuery) {
		matches = applyQueryFilter(searchQuery, matches)
	}
	// Include ancestors, not only direct matches.
	const matchesWithAncestors = includeMatchAncestors(matches, variables)
	// Count direct matches only
	const numMatches = matches.length

	return (
		<div>
			<div className={s.searchRow}>
				<FilterInput
					className={s.filterInputMarginReset}
					placeholder={`Search ${groupName}`}
					value={searchQuery}
					onChange={(value: string) => setSearchQuery(value)}
					IconComponent={IconSearch16}
				/>
				{isRequiredRelevant ? (
					<div className={s.checkboxContainer}>
						<CheckboxField
							label="Required only"
							checked={requiredOnly}
							onChange={() => setRequiredOnly(!requiredOnly)}
						/>
					</div>
				) : null}
			</div>
			<p className={s.results}>
				{numMatches} {numMatches === 1 ? 'Result' : 'Results'}
			</p>
			<VariableGroupList variables={matchesWithAncestors} />
		</div>
	)
}
