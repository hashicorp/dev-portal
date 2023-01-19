import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import classNames from 'classnames'
import { Integration, Tier } from 'lib/integrations-api-client/integration'
import { useEffect, useMemo, useRef, useState } from 'react'
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

interface SearchableIntegrationsListProps {
	className: string
}

import {
	useQueryParam,
	StringParam,
	NumberParam,
	withDefault,
} from 'use-query-params'

import { encodeDelimitedArray, decodeDelimitedArray } from 'use-query-params'

/**
 * Uses a comma to delimit entries. e.g. ['a', 'b'] => qp?=a,b
 * https://github.com/pbeshai/use-query-params/blob/master/packages/use-query-params/README.md?plain=1#L374-L380
 */
const CommaArrayParam = {
	encode: (array: string[] | null | undefined) =>
		encodeDelimitedArray(array, ','),

	decode: (arrayStr: string | string[] | null | undefined) =>
		decodeDelimitedArray(arrayStr, ','),
}

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
		{ updateType: 'replaceIn', removeDefaultsFromUrl: true }
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

	const [qsTiers, setQsTiers] = useQueryParam(
		'tiers',
		withDefault(CommaArrayParam, []),
		{
			enableBatching: true,
			updateType: 'replaceIn',
			removeDefaultsFromUrl: true,
		}
	)

	const [qsComponents, setQsComponents] = useQueryParam(
		'components',
		withDefault(CommaArrayParam, []),
		{
			enableBatching: true,
			updateType: 'replaceIn',
			removeDefaultsFromUrl: true,
		}
	)

	const [qsFlags, setQsFlags] = useQueryParam(
		'flags',
		withDefault(CommaArrayParam, []),
		{
			enableBatching: true,
			updateType: 'replaceIn',
			removeDefaultsFromUrl: true,
		}
	)

	// integrations search context will sit downstream of URL state
	// Update URL state when ---> update context
	// - Don't update context directly
	const {
		tierOptions,
		// officialChecked,
		setOfficialChecked,
		// partnerChecked,
		setPartnerChecked,
		// communityChecked,
		setCommunityChecked,
		sortedComponents,
		// componentCheckedArray,
		setComponentCheckedArray,
		flags,
		// flagsCheckedArray,
		setFlagsCheckedArray,
		atLeastOneFacetSelected,
	} = useIntegrationsSearchContext()

	const officialChecked = qsTiers.includes(Tier.OFFICIAL)
	const partnerChecked = qsTiers.includes(Tier.PARTNER)
	const communityChecked = qsTiers.includes(Tier.COMMUNITY)

	const componentCheckedArray = useMemo(() => {
		return sortedComponents.map((component) => {
			return qsComponents.includes(component.slug)
		})
	}, [sortedComponents, qsComponents])

	const isMounted = useRef(false)
	// update Context when URL state changes
	useEffect(() => {
		if (typeof window === 'undefined') {
			return
		}
		isMounted.current = true
		// update tiers
		setOfficialChecked(officialChecked)
		setPartnerChecked(partnerChecked)
		setCommunityChecked(communityChecked)

		// update components
		setComponentCheckedArray(componentCheckedArray)

		// update flags
		setFlagsCheckedArray(flagsCheckedArray)
	}, [])

	const flagsCheckedArray = useMemo(() => {
		return flags.map((flag) => {
			return qsFlags.includes(flag.slug)
		})
	}, [flags, qsFlags])

	// handleClearFilters resets the state of all filters
	const handleClearFilters = (e) => {
		resetPage()

		// reset URL
		setQsTiers([])
		setQsComponents([])
		setQsFlags([])

		// reset context
		setOfficialChecked(false)
		setPartnerChecked(false)
		setCommunityChecked(false)
		setComponentCheckedArray(componentCheckedArray.map((v, i) => false))
		setFlagsCheckedArray(flagsCheckedArray.map((v, i) => false))
	}

	const makeToggleTierHandler = (e: Tier) => () => {
		resetPage()

		if (e === Tier.OFFICIAL) {
			if (qsTiers.includes(Tier.OFFICIAL)) {
				setQsTiers(qsTiers.filter((tier) => tier !== Tier.OFFICIAL))
				setOfficialChecked(false)
			} else {
				setQsTiers([...qsTiers, Tier.OFFICIAL])
				setOfficialChecked(true)
			}
		}
		if (e === Tier.PARTNER) {
			if (qsTiers.includes(Tier.PARTNER)) {
				setQsTiers(qsTiers.filter((tier) => tier !== Tier.PARTNER))
				setPartnerChecked(false)
			} else {
				setQsTiers([...qsTiers, Tier.PARTNER])
				setPartnerChecked(true)
			}
		}
		if (e === Tier.COMMUNITY) {
			if (qsTiers.includes(Tier.COMMUNITY)) {
				setQsTiers(qsTiers.filter((tier) => tier !== Tier.COMMUNITY))
				setCommunityChecked(false)
			} else {
				setQsTiers([...qsTiers, Tier.COMMUNITY])
				setCommunityChecked(true)
			}
		}
	}

	const makeToggleFlagHandler = (i: number) => () => {
		// reset page
		resetPage()
		// update URL
		if (qsFlags.includes(flags[i].slug)) {
			setQsFlags(qsFlags.filter((flag) => flag !== flags[i].slug))
		} else {
			setQsFlags([...qsFlags, flags[i].slug])
		}
		// update context
		setFlagsCheckedArray((prev) => {
			const next = [...prev]
			next[i] = !next[i]
			return next
		})
	}

	const makeToggleComponentHandler = (i: number) => () => {
		// reset page
		resetPage()
		const isInQs = qsComponents.includes(sortedComponents[i].slug)
		// update URL
		if (isInQs) {
			setQsComponents(
				qsComponents.filter(
					(component) => component !== sortedComponents[i].slug
				)
			)
		} else {
			setQsComponents([...qsComponents, sortedComponents[i].slug])
		}

		// update context
		setComponentCheckedArray((prev) => {
			const next = [...prev]
			next[i] = !isInQs
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
									onClick={makeToggleComponentHandler(i)}
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
										onClick={makeToggleFlagHandler(i)}
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
									onRemove={makeToggleComponentHandler(i)}
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
									onRemove={makeToggleFlagHandler(i)}
								/>
							)
						)
					})}

					{/* prevent flash */}
					{isMounted.current ? (
						<>
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
						</>
					) : null}
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
