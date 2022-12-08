import { useState } from 'react'
import classNames from 'classnames'
import s from './style.module.css'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import IntegrationsList from '../integrations-list'

export default function SearchableIntegrationsList({
	integrations,
	className,
}) {
	const [searchQuery, setSearchQuery] = useState('')
	const filteredIntegrations = integrations.filter((integration) => {
		return (
			integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			integration.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			integration.organization.slug
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		)
	})

	return (
		<div className={classNames(s.searchableIntegrationsList, className)}>
			<SearchBar
				searchQuery={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<p className={s.results}>
				{filteredIntegrations.length}{' '}
				{filteredIntegrations.length === 1 ? 'Result' : 'Results'}
			</p>
			<IntegrationsList integrations={filteredIntegrations} />
		</div>
	)
}

function SearchBar({ searchQuery, onChange }) {
	return (
		<div className={s.searchBar}>
			<IconSearch16 />
			<input
				type="text"
				placeholder="Search integrations"
				value={searchQuery}
				onChange={onChange}
			/>
		</div>
	)
}
