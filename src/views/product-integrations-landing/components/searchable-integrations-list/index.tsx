import { IconCheck16 } from '@hashicorp/flight-icons/svg-react/check-16'
import { IconFilter16 } from '@hashicorp/flight-icons/svg-react/filter-16'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import capitalize from '@hashicorp/platform-util/text/capitalize'
import classNames from 'classnames'
import Button from 'components/button'
import Dialog from 'components/dialog'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
} from 'components/dropdown-disclosure'
import Legend from 'components/form/components/legend'
import { CheckboxField } from 'components/form/field-controls'
import Tag from 'components/tag'
import useTypingDebounce from 'lib/hooks/use-typing-debounce'
import { Integration, Tier } from 'lib/integrations-api-client/integration'
import { useCallback, useState } from 'react'
import { useIntegrationsSearchContext } from 'views/product-integrations-landing/contexts/integrations-search-context'
import PaginatedIntegrationsList from '../paginated-integrations-list'
import {
	integrationLibraryFilterSelectedEvent,
	integrationLibrarySearchedEvent,
} from './helpers/analytics'
import s from './style.module.css'

interface SearchableIntegrationsListProps {
	className: string
}

import {
	NumberParam,
	StringParam,
	useQueryParam,
	withDefault,
} from 'use-query-params'

export default function SearchableIntegrationsList({
	className,
}: SearchableIntegrationsListProps) {
	const { filteredIntegrations: integrations } = useIntegrationsSearchContext()

	const [, setCurrentPage] = useQueryParam(
		'page',
		withDefault(NumberParam, 1),
		{
			enableBatching: true,
			updateType: 'replaceIn',
			removeDefaultsFromUrl: true,
		}
	)
	const resetPage = () => setCurrentPage(1)
	const [filterQuery, setFilterQuery] = useQueryParam(
		'filter',
		withDefault(StringParam, ''),
		{
			enableBatching: true,
			updateType: 'replaceIn',
			removeDefaultsFromUrl: true,
		}
	)

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
	 *
	 * Note: we only want to track this event if the query input is meaningful.
	 * We consider query input lengths of more than 2 characters to be meaningful
	 * (in fact, we don't filter results unless the query is > 2 chars long).
	 *
	 * Note as well that we useTypingDebounce here to reduce the number of events.
	 * Without useTypingDebounce, an event would fire on every character typed.
	 */
	const searchedEventCallback = useCallback(() => {
		if (filterQuery.length > 2) {
			integrationLibrarySearchedEvent({
				search_query: filterQuery,
				results_count: filteredIntegrations.length,
			})
		}
	}, [filterQuery, filteredIntegrations.length])
	useTypingDebounce(searchedEventCallback)

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
		atLeastOneFacetSelected,
	} = useIntegrationsSearchContext()

	// handleClearFilters resets the state of all filters
	const handleClearFilters = (e) => {
		resetPage()

		setFilterQuery('')
		setOfficialChecked(false)
		setPartnerChecked(false)
		setCommunityChecked(false)

		setComponentCheckedArray(componentCheckedArray.map((v, i) => false))
		setFlagsCheckedArray(flagsCheckedArray.map((v, i) => false))
	}

	const makeToggleTierHandler = (tier: Tier) => () => {
		// reset page on filter change
		resetPage()

		// small wrapper to trigger analytics event if given a `true` value
		const fireTierAnalytics = (value: boolean) => {
			if (value) {
				integrationLibraryFilterSelectedEvent({
					filter_category: 'tier',
					filter_value: tier,
				})
			}
		}

		switch (tier) {
			case Tier.OFFICIAL: {
				const next = !officialChecked
				fireTierAnalytics(next)
				setOfficialChecked(next)
				break
			}
			case Tier.PARTNER: {
				const next = !partnerChecked
				fireTierAnalytics(next)
				setPartnerChecked(next)
				break
			}
			case Tier.COMMUNITY: {
				const next = !communityChecked
				fireTierAnalytics(next)
				setCommunityChecked(next)
				break
			}
		}
	}

	const makeToggleFlagHandler = (i: number, flagName: string) => () => {
		// reset page on filter change
		resetPage()

		const newFlags = [...flagsCheckedArray]
		const isFlagSelectedInNext = !newFlags[i]
		// When any flag input is checked, track an analytics filtered event
		if (isFlagSelectedInNext) {
			integrationLibraryFilterSelectedEvent({
				filter_category: 'flag',
				filter_value: flagName,
			})
		}

		newFlags[i] = isFlagSelectedInNext
		setFlagsCheckedArray(newFlags)
	}

	const makeToggleComponentHandler =
		(i: number, componentName: string) => () => {
			// reset page on filter change
			resetPage()

			const newComponents = [...componentCheckedArray]
			const isComponentSelectedInNext = !newComponents[i]
			if (isComponentSelectedInNext) {
				integrationLibraryFilterSelectedEvent({
					filter_category: 'component',
					filter_value: componentName,
				})
			}
			newComponents[i] = isComponentSelectedInNext
			setComponentCheckedArray(newComponents)
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
					onChange={(e) => {
						setFilterQuery(e.target.value)
						resetPage()
					}}
				/>

				<div className={s.filterOptions}>
					{/* tablet_up */}
					<div className={classNames(s.selectStack, s.tablet_up)}>
						<DropdownDisclosure color="secondary" text="Tiers">
							{tierOptions.map((e) => {
								const checked =
									(e === Tier.OFFICIAL && officialChecked) ||
									(e === Tier.PARTNER && partnerChecked) ||
									(e === Tier.COMMUNITY && communityChecked)
								return (
									<DropdownDisclosureButtonItem
										key={e}
										onClick={makeToggleTierHandler(e)}
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
									onClick={makeToggleComponentHandler(i, e.name)}
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
										onClick={makeToggleFlagHandler(i, e.name)}
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
									onRemove={makeToggleTierHandler(e)}
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
									onRemove={makeToggleComponentHandler(i, e.name)}
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
									onRemove={makeToggleFlagHandler(i, e.name)}
								/>
							)
						)
					})}

					{atLeastOneFacetSelected ? (
						<Button
							text="Reset filters"
							icon={<IconX16 />}
							color="tertiary"
							size="small"
							className={s.tablet_up}
							onClick={handleClearFilters}
						/>
					) : (
						<div className={s.noFilters}>No filters selected</div>
					)}
				</div>
			</div>

			<div className={classNames(s.results, s.mobile_only)}>{resultText}</div>

			<PaginatedIntegrationsList
				integrations={filteredIntegrations}
				onClearFiltersClicked={() => {
					handleClearFilters(null)
				}}
			/>

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
				setOfficialChecked(!officialChecked)
				break
			case Tier.PARTNER:
				setPartnerChecked(!partnerChecked)
				break
			case Tier.COMMUNITY:
				setCommunityChecked(!communityChecked)
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
