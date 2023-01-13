import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import classNames from 'classnames'
import { Integration, Tier } from 'lib/integrations-api-client/integration'
import { useState } from 'react'
import { useIntegrationsSearchContext } from 'views/product-integrations-landing/contexts/integrations-search-context'
import PaginatedIntegrationsList from '../paginated-integrations-list'
import s from './style.module.css'
import capitalize from '@hashicorp/platform-util/text/capitalize'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import { IconCheck16 } from '@hashicorp/flight-icons/svg-react/check-16'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
} from 'components/dropdown-disclosure'
import Tag from 'components/tag'

interface SearchableIntegrationsListProps {
	className: string
}

export default function SearchableIntegrationsList({
	className,
}: SearchableIntegrationsListProps) {
	const { filteredIntegrations: integrations } = useIntegrationsSearchContext()

	const [filterQuery, setFilterQuery] = useState('')
	const filteredIntegrations = integrations.filter(
		(integration: Integration) => {
			return (
				integration.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
				integration.description
					.toLowerCase()
					.includes(filterQuery.toLowerCase()) ||
				integration.organization.slug
					.toLowerCase()
					.includes(filterQuery.toLowerCase())
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
		flags,
		flagsCheckedArray,
		setFlagsCheckedArray,
		atLeastOneFacetSelected,
	} = useIntegrationsSearchContext()

	// handleClearFilters resets the state of all filters
	const handleClearFilters = (e) => {
		setOfficialChecked(false)
		setPartnerChecked(false)
		setCommunityChecked(false)
		setComponentCheckedArray(componentCheckedArray.map((v, i) => false))
		setFlagsCheckedArray(flagsCheckedArray.map((v, i) => false))
	}

	const makeUncheckTierHandler = (e: Tier) => () => {
		switch (e) {
			case Tier.OFFICIAL:
				return setOfficialChecked((p) => !p)
			case Tier.PARTNER:
				return setPartnerChecked((p) => !p)
			case Tier.COMMUNITY:
				return setCommunityChecked((p) => !p)
		}
	}

	const makeUncheckFlagHandler = (i: number) => () => {
		setFlagsCheckedArray((prev) => {
			const next = [...prev]
			next[i] = !next[i]
			return next
		})
	}

	const makeUncheckComponentHandler = (i: number) => () => {
		setComponentCheckedArray((prev) => {
			const next = [...prev]
			next[i] = !next[i]
			return next
		})
	}

	return (
		<div className={classNames(s.searchableIntegrationsList, className)}>
			<div className={s.header}>
				<FilterBar
					filterQuery={filterQuery}
					onChange={(e) => setFilterQuery(e.target.value)}
				/>

				<div className={s.filterOptions}>
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
										onClick={makeUncheckTierHandler(e)}
									>
										<div className={s.option}>
											<span className={s.check}>
												{checked && <IconCheck16 />}
											</span>
											{capitalize(e)}
										</div>
									</DropdownDisclosureButtonItem>
								)
							})}
						</DropdownDisclosure>
						<DropdownDisclosure color="secondary" text="Components">
							{sortedComponents.map((e, i) => (
								<DropdownDisclosureButtonItem
									key={e.id}
									onClick={makeUncheckComponentHandler(i)}
								>
									<div className={s.option}>
										<span className={s.check}>
											{componentCheckedArray[i] && <IconCheck16 />}
										</span>
										{capitalize(e.plural_name)}
									</div>
								</DropdownDisclosureButtonItem>
							))}
						</DropdownDisclosure>

						<DropdownDisclosure color="secondary" text="Flags">
							{flags.map((e, i) => {
								return (
									<DropdownDisclosureButtonItem
										onClick={makeUncheckFlagHandler(i)}
										key={e.id}
									>
										<div className={s.option}>
											<span className={s.check}>
												{flagsCheckedArray[i] && <IconCheck16 />}
											</span>
											{e.name}
										</div>
									</DropdownDisclosureButtonItem>
								)
							})}
						</DropdownDisclosure>
					</div>
					<span className={s.results}>
						{filteredIntegrations.length}{' '}
						{filteredIntegrations.length === 1
							? 'result found'
							: 'results found'}
					</span>
				</div>

				<div className={s.filterInfo}>
					{atLeastOneFacetSelected ? (
						<button
							title="Clear filters"
							className={s.clearFilters}
							onClick={handleClearFilters}
						>
							<IconX16 />
							<span>Clear filters</span>
						</button>
					) : (
						<span className={s.noFilters}>No filters selected</span>
					)}

					{/* Render x-tags for tiers */}
					{tierOptions.map((e) => {
						const checked =
							(e === Tier.OFFICIAL && officialChecked) ||
							(e === Tier.PARTNER && partnerChecked) ||
							(e === Tier.COMMUNITY && communityChecked)
						return (
							checked && (
								<Tag
									key={e}
									text={capitalize(e)}
									onRemove={makeUncheckTierHandler(e)}
								/>
							)
						)
					})}
					{/* Render x-tags for components */}
					{sortedComponents.map((e, i) => {
						const checked = componentCheckedArray[i]
						return (
							checked && (
								<Tag
									key={e.id}
									text={capitalize(e.plural_name)}
									onRemove={makeUncheckComponentHandler(i)}
								/>
							)
						)
					})}
					{/* Render x-tags for flags */}
					{flags.map((e, i) => {
						const checked = flagsCheckedArray[i]
						return (
							checked && (
								<Tag
									key={e.id}
									text={e.name}
									onRemove={makeUncheckFlagHandler(i)}
								/>
							)
						)
					})}
				</div>
			</div>

			<PaginatedIntegrationsList integrations={filteredIntegrations} />
		</div>
	)
}

function FilterBar({ filterQuery, onChange }) {
	return (
		<div className={s.searchBar}>
			<IconSearch16 />
			<input
				type="text"
				placeholder="Filter integrations"
				value={filterQuery}
				onChange={onChange}
			/>
		</div>
	)
}
