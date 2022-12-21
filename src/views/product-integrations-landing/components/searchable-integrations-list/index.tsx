import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import classNames from 'classnames'
import { Integration, Tier } from 'lib/integrations-api-client/integration'
import { useState } from 'react'
import { useIntegrationsSearchContext } from 'views/product-integrations-landing/contexts/integrations-search-context'
import PaginatedIntegrationsList from '../paginated-integrations-list'
import s from './style.module.css'
import capitalize from '@hashicorp/platform-util/text/capitalize'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
} from 'components/dropdown-disclosure'

interface SearchableIntegrationsListProps {
	className: string
}

export default function SearchableIntegrationsList({
	className,
}: SearchableIntegrationsListProps) {
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

	const {
		tierOptions,
		matchingOfficial,
		officialChecked,
		setOfficialChecked,
		matchingVerified,
		partnerChecked,
		setPartnerChecked,
		matchingCommunity,
		communityChecked,
		setCommunityChecked,
		sortedComponents,
		componentCheckedArray,
		setComponentCheckedArray,
		atLeastOneFacetSelected,
	} = useIntegrationsSearchContext()

	return (
		<div className={classNames(s.searchableIntegrationsList, className)}>
			<div className={s.header}>
				<h1>Integrations</h1>
				<SearchBar
					searchQuery={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>

				<div className={s.selectStack}>
					<DropdownDisclosure color="secondary" text="Tier">
						{tierOptions.map((e) => {
							const checked =
								(e === Tier.OFFICIAL && officialChecked) ||
								(e === Tier.PARTNER && partnerChecked) ||
								(e === Tier.COMMUNITY && communityChecked)
							return (
								<DropdownDisclosureButtonItem
									key={e}
									onClick={() => {
										switch (e) {
											case Tier.OFFICIAL:
												return setOfficialChecked((p) => !p)
											case Tier.PARTNER:
												return setPartnerChecked((p) => !p)
											case Tier.COMMUNITY:
												return setCommunityChecked((p) => !p)
										}
									}}
								>
									{checked ? '✅ ' : ''}
									{capitalize(e)}
								</DropdownDisclosureButtonItem>
							)
						})}
					</DropdownDisclosure>
					<DropdownDisclosure color="secondary" text="Components">
						{sortedComponents.map((e, i) => (
							<DropdownDisclosureButtonItem
								key={e.id}
								onClick={() =>
									setComponentCheckedArray((prev) => {
										const next = [...prev]
										next[i] = !next[i]
										return next
									})
								}
							>
								{componentCheckedArray[i] ? '✅ ' : ''}
								{capitalize(e.plural_name)}
							</DropdownDisclosureButtonItem>
						))}
					</DropdownDisclosure>

					<DropdownDisclosure color="secondary" text="Attributes">
						<DropdownDisclosureButtonItem onClick={() => {}}>
							Todo
						</DropdownDisclosureButtonItem>
						<DropdownDisclosureButtonItem onClick={() => {}}>
							Todo
						</DropdownDisclosureButtonItem>
						<DropdownDisclosureButtonItem onClick={() => {}}>
							Todo
						</DropdownDisclosureButtonItem>
					</DropdownDisclosure>

					{atLeastOneFacetSelected && (
						<button
							title="Clear filters"
							className={s.clearFilters}
							onClick={(e) => {
								setOfficialChecked(false)
								setPartnerChecked(false)
								setCommunityChecked(false)
								setComponentCheckedArray(
									componentCheckedArray.map((v, i) => {
										return false
									})
								)
							}}
						>
							<IconX16 />
							<span>Clear filters</span>
						</button>
					)}
				</div>
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
