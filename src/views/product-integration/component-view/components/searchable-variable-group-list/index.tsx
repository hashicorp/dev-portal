import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import { CheckboxField } from 'components/form/field-controls'
import { useState } from 'react'
import { Variable, VariableGroupList } from '../variable-group-list'
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
	let numMatches: number

	/**
	 * If we're only showing required variables, filter optional variables out
	 * TODO: split this into a separate function, maybe?
	 */
	let withRequiredFilter: Array<Variable> = variables
	if (requiredOnly === true) {
		withRequiredFilter = withRequiredFilter.filter((variable: Variable) => {
			return variable.required === true
		})
	}
	numMatches = withRequiredFilter.length

	/**
	 * If we have a search query, filter variables further based on the query
	 * TODO: split this into a separate function, maybe?
	 */
	let withQueryFilter: Array<Variable> = withRequiredFilter
	if (searchQuery.length >= 2) {
		{
			// Filter all the variables that have been directly matched via the Search Query
			const directMatches = withRequiredFilter.filter((variable: Variable) => {
				return (
					variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
					variable.description
						?.toLowerCase()
						.includes(searchQuery.toLowerCase())
				)
			})
			numMatches = directMatches.length

			// Determine all of the variables that need to be included in the results
			// This includes all of the ones matched above, but also their parents
			const allKeys = []
			directMatches
				.map((variable: Variable) => variable.key)
				.forEach((matchedKey: string) => {
					const segments = matchedKey.split('.')
					segments.forEach((segment: string, i: number) => {
						allKeys.push(
							matchedKey
								.split('.')
								.slice(0, i + 1)
								.join('.')
						)
					})
				})
			const allKeysUnique = Array.from(new Set(allKeys))
			withQueryFilter = withRequiredFilter
				.filter((variable: Variable) => allKeysUnique.includes(variable.key))
				.map((variable: Variable) => {
					// If a variable was a direct match, specify highlight as a prop
					if (
						directMatches
							.map((variable: Variable) => variable.key)
							.includes(variable.key)
					) {
						return {
							...variable,
							highlight: true,
						}
					} else {
						return variable
					}
				})
		}
	}

	return (
		<div>
			<div className={s.searchRow}>
				<SearchBar
					groupName={groupName}
					searchQuery={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<CheckboxField
					label="Required only"
					checked={requiredOnly}
					onChange={() => setRequiredOnly(!requiredOnly)}
				/>
			</div>
			<p className={s.results}>
				{numMatches} {numMatches === 1 ? 'Result' : 'Results'}
			</p>
			<VariableGroupList variables={withQueryFilter} />
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
