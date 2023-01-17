import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
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
	 */
	const matchesRequired = applyRequiredFilter(requiredOnly, variables)
	const directMatches = applyQueryFilter(searchQuery, matchesRequired)
	const numMatches = directMatches.length
	const matchesWithAncestors = includeMatchAncestors(directMatches, variables)

	return (
		<div>
			<div className={s.searchRow}>
				<SearchBar
					groupName={groupName}
					searchQuery={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
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

function SearchBar({ groupName, searchQuery, onChange }) {
	return (
		<div className={s.searchBar}>
			<IconSearch16 />
			<input
				type="text"
				placeholder={`Search ${groupName}`}
				value={searchQuery}
				onChange={onChange}
			/>
		</div>
	)
}
