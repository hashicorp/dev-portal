import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import classNames from 'classnames'
import { Integration } from 'lib/integrations-api-client/integration'
import { useState } from 'react'
import { useMobileDrawerContext } from 'views/product-integrations-landing/contexts/mobile-drawer-context'
import { useIntegrationsSearchContext } from 'views/product-integrations-landing/contexts/integrations-search-context'
import PaginatedIntegrationsList from '../paginated-integrations-list'
import s from './style.module.css'
import Button from 'components/button'
import { IconSliders16 } from '@hashicorp/flight-icons/svg-react/sliders-16'

interface SearchableIntegrationsListProps {
	className: string
}

interface CustomHeaderStyles extends React.CSSProperties {
	'--background-image': string
}

const headerStyleVars: CustomHeaderStyles = {
	'--background-image': `url('${require('./img/header-background.svg?url')}')`,
}

export default function SearchableIntegrationsList({
	className,
}: SearchableIntegrationsListProps) {
	const { setDialogOpen } = useMobileDrawerContext()
	const { filteredIntegrations: integrations } = useIntegrationsSearchContext()

	const [searchQuery, setSearchQuery] = useState('')
	const filteredIntegrations = integrations.filter(
		(integration: Integration) => {
			return (
				integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				integration.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				integration.organization.slug
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
			)
		}
	)

	return (
		<div className={classNames(s.searchableIntegrationsList, className)}>
			<div className={s.header} style={headerStyleVars}>
				<h1>Integrations</h1>
				<SearchBar
					searchQuery={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<Button
					text="Filters"
					icon={<IconSliders16 />}
					color="secondary"
					className={classNames('g-show-with-mobile-menu', s.filterButton)}
					onClick={() => setDialogOpen(true)}
				/>
			</div>

			<p className={s.results}>
				{filteredIntegrations.length}{' '}
				{filteredIntegrations.length === 1 ? 'Result' : 'Results'}
			</p>
			<PaginatedIntegrationsList integrations={filteredIntegrations} />
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
