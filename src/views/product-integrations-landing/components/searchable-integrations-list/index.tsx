import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import classNames from 'classnames'
import { Integration, Tier } from 'lib/integrations-api-client/integration'
import { useEffect, useState } from 'react'
import { useIntegrationsSearchContext } from 'views/product-integrations-landing/contexts/integrations-search-context'
import PaginatedIntegrationsList from '../paginated-integrations-list'
import s from './style.module.css'
import capitalize from '@hashicorp/platform-util/text/capitalize'
import { IconCheck16 } from '@hashicorp/flight-icons/svg-react/check-16'
import { IconFilter16 } from '@hashicorp/flight-icons/svg-react/filter-16'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
} from 'components/dropdown-disclosure'
import Button from 'components/button'
import Tag from 'components/tag'
import Dialog from 'components/dialog'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import { CheckboxField } from 'components/form/field-controls'
import Legend from 'components/form/components/legend'
import {
	integrationLibraryFilterSelectedEvent,
	integrationLibrarySearchedEvent,
} from './helpers/analytics'

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

	/**
	 * Track an "integration_library_searched" event when the filterQuery changes
	 */
	useEffect(() => {
		// Note: we only want to track this event if the query input is meaningful
		if (filterQuery.length > 2) {
			integrationLibrarySearchedEvent({
				search_query: filterQuery,
				results_count: filteredIntegrations.length,
			})
		}
	}, [filterQuery, filteredIntegrations])

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
		// Set up a toggle checked function that also fires analytics
		const tierToggleFunction = (p) => {
			const isSelectedNext = !p
			if (isSelectedNext) {
				integrationLibraryFilterSelectedEvent({
					filter_category: 'tier',
					filter_value: e,
				})
			}
			return isSelectedNext
		}
		switch (e) {
			case Tier.OFFICIAL:
				return setOfficialChecked(tierToggleFunction)
			case Tier.PARTNER:
				return setPartnerChecked(tierToggleFunction)
			case Tier.COMMUNITY:
				return setCommunityChecked(tierToggleFunction)
		}
	}

	const makeUncheckFlagHandler = (i: number, flagName: string) => () => {
		setFlagsCheckedArray((prev) => {
			const next = [...prev]
			const isFlagSelectedInNext = !next[i]
			// When any flag input is checked, track an analytics filtered event
			if (isFlagSelectedInNext) {
				integrationLibraryFilterSelectedEvent({
					filter_category: 'flag',
					filter_value: flagName,
				})
			}
			next[i] = isFlagSelectedInNext
			return next
		})
	}

	const makeUncheckComponentHandler =
		(i: number, componentName: string) => () => {
			setComponentCheckedArray((prev) => {
				const next = [...prev]
				const isComponentSelectedInNext = !next[i]
				// When any component input is checked, track an analytics filtered event
				if (isComponentSelectedInNext) {
					integrationLibraryFilterSelectedEvent({
						filter_category: 'component',
						filter_value: componentName,
					})
				}
				next[i] = isComponentSelectedInNext
				return next
			})
		}

	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

	const resultText = `${filteredIntegrations.length} ${
		filteredIntegrations.length === 1 ? 'result found' : 'results found'
	}`
	return (
		<div className={classNames(s.searchableIntegrationsList, className)}>
			<div className={s.header}>
				<FilterBar
					filterQuery={filterQuery}
					onChange={(e) => setFilterQuery(e.target.value)}
				/>

				<div className={s.filterOptions}>
					{/* tablet_up */}
					<div className={classNames(s.selectStack, s.tablet_up)}>
						<DropdownDisclosure color="secondary" text="Tier">
							{tierOptions.map((e, index) => {
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
									onClick={makeUncheckComponentHandler(i, e.name)}
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
										onClick={makeUncheckFlagHandler(i, e.name)}
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
					<span className={classNames(s.results, s.tablet_up)}>
						{resultText}
					</span>

					{/* mobile_only */}
					<div className={classNames(s.row, s.mobile_only)}>
						<Button
							className={s.row_fill}
							text="Filters"
							color="secondary"
							icon={<IconFilter16 />}
							iconPosition="trailing"
							onClick={() => setIsFilterDialogOpen(true)}
						/>
					</div>
				</div>

				<div className={s.filterInfo}>
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
									onRemove={makeUncheckComponentHandler(i, e.name)}
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
									onRemove={makeUncheckFlagHandler(i, e.name)}
								/>
							)
						)
					})}

					{atLeastOneFacetSelected ? (
						<button
							className={classNames(s.clearFilters, s.tablet_up)}
							onClick={handleClearFilters}
						>
							<span>Reset filters</span>
						</button>
					) : (
						<span className={s.noFilters}>No filters selected</span>
					)}
				</div>
			</div>

			<div className={classNames(s.results, s.mobile_only)}>{resultText}</div>

			<PaginatedIntegrationsList integrations={filteredIntegrations} />

			{/* 
				Mobile Filter Dialog
				- This dialog is rendered in a portal, so where it
					exists in JSX markup is not super important.
				*/}
			<Dialog
				isOpen={isFilterDialogOpen}
				label="Tutorial filters"
				onDismiss={() => setIsFilterDialogOpen(false)}
				variant="bottom"
			>
				<div className={classNames(s.row, s.justifyEnd)}>
					<button
						className={s.exitIcon}
						onClick={() => setIsFilterDialogOpen(false)}
						aria-label="Cancel"
						type="button"
					>
						<IconX16 />
					</button>
				</div>
				<div className={s.row}>
					<Button
						text="Done"
						onClick={() => setIsFilterDialogOpen(false)}
						className={s.row_fill}
					/>
					<Button
						disabled={!atLeastOneFacetSelected}
						text="Reset Filters"
						icon={<IconX16 />}
						color="tertiary"
						onClick={handleClearFilters}
						className={s.row_fill}
					/>
				</div>

				<div className={s.mobileFilters}>
					<MobileFilters />
				</div>
			</Dialog>
		</div>
	)
}

// Renders Tier/Component/Flags checkboxes
function MobileFilters() {
	const {
		tierOptions,
		officialChecked,
		setOfficialChecked,
		partnerChecked,
		setPartnerChecked,
		communityChecked,
		setCommunityChecked,
		sortedComponents,
		componentCheckedArray,
		setComponentCheckedArray,
		flags,
		flagsCheckedArray,
		setFlagsCheckedArray,
	} = useIntegrationsSearchContext()

	const makeToggleTierHandler = (tier: Tier) => () => {
		switch (tier) {
			case Tier.OFFICIAL:
				setOfficialChecked((s) => !s)
				break
			case Tier.PARTNER:
				setPartnerChecked((s) => !s)
				break
			case Tier.COMMUNITY:
				setCommunityChecked((s) => !s)
				break
		}
	}

	const makeToggleComponentHandler = (index: number) => () => {
		const newComponentCheckedArray = [...componentCheckedArray]
		newComponentCheckedArray[index] = !newComponentCheckedArray[index]
		setComponentCheckedArray(newComponentCheckedArray)
	}

	const makeToggleFlagHandler = (index: number) => () => {
		const newFlagsCheckedArray = [...flagsCheckedArray]
		newFlagsCheckedArray[index] = !newFlagsCheckedArray[index]
		setFlagsCheckedArray(newFlagsCheckedArray)
	}

	return (
		<>
			<div className={s.optionsContainer}>
				<Legend>Tier</Legend>
				{tierOptions.map((e) => {
					const checked =
						(e === Tier.OFFICIAL && officialChecked) ||
						(e === Tier.PARTNER && partnerChecked) ||
						(e === Tier.COMMUNITY && communityChecked)
					return (
						<CheckboxField
							key={e}
							labelFontWeight="regular"
							label={capitalize(e)}
							checked={checked}
							onChange={makeToggleTierHandler(e)}
						/>
					)
				})}
			</div>

			<div className={s.optionsContainer}>
				<Legend>Component</Legend>
				{sortedComponents.map((e, i) => {
					const checked = componentCheckedArray[i]
					return (
						<CheckboxField
							key={e.id}
							labelFontWeight="regular"
							label={capitalize(e.plural_name)}
							checked={checked}
							onChange={makeToggleComponentHandler(i)}
						/>
					)
				})}
			</div>

			<div className={s.optionsContainer}>
				<Legend>Flags</Legend>
				{flags.map((e, i) => {
					const checked = flagsCheckedArray[i]
					return (
						<CheckboxField
							key={e.id}
							labelFontWeight="regular"
							label={e.name}
							checked={checked}
							onChange={makeToggleFlagHandler(i)}
						/>
					)
				})}
			</div>
		</>
	)
}

function FilterBar({ filterQuery, onChange }) {
	return (
		<div className={s.searchBar}>
			<IconSearch16 />
			{/* TODO: consider <FilterInput/> */}
			<input
				type="text"
				placeholder="Filter integrations"
				value={filterQuery}
				onChange={onChange}
			/>
		</div>
	)
}
