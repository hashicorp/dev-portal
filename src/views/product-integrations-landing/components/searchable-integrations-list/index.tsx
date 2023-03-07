/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useState } from 'react'
import classNames from 'classnames'
import { IconFilter16 } from '@hashicorp/flight-icons/svg-react/filter-16'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import useTypingDebounce from 'lib/hooks/use-typing-debounce'
import { useIntegrationsSearchContext } from 'views/product-integrations-landing/contexts/integrations-search-context'
import Button from 'components/button'
import Dialog from 'components/dialog'
import Legend from 'components/form/components/legend'
import { CheckboxField } from 'components/form/field-controls'
import Tag from 'components/tag'
import FilterInput from 'components/filter-input'
import MultiSelect from 'components/multi-select'
import PaginatedIntegrationsList from '../paginated-integrations-list'
import { integrationLibrarySearchedEvent } from './helpers/analytics'
import s from './style.module.css'

interface SearchableIntegrationsListProps {
	className: string
}

export default function SearchableIntegrationsList({
	className,
}: SearchableIntegrationsListProps) {
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
	const {
		atLeastOneFacetSelected,
		clearFilters,
		componentOptions,
		filteredIntegrations,
		filterQuery,
		flagOptions,
		resetPage,
		setFilterQuery,
		tierOptions,
	} = useIntegrationsSearchContext()

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

	const resultText = `${filteredIntegrations.length} ${
		filteredIntegrations.length === 1 ? 'result found' : 'results found'
	}`
	return (
		<div className={classNames(s.searchableIntegrationsList, className)}>
			<div className={s.header}>
				<FilterInput
					className={s.filterInput}
					IconComponent={IconSearch16}
					value={filterQuery}
					onChange={(v: string) => {
						resetPage()
						setFilterQuery(v)
					}}
				/>

				<div className={s.filterOptions}>
					{/* tablet_up */}
					<div className={classNames(s.selectStack, s.tablet_up)}>
						<MultiSelect text="Tiers" options={tierOptions} />
						<MultiSelect text="Components" options={componentOptions} />
						<MultiSelect text="Flags" options={flagOptions} />
					</div>
					{/**
					 * Technique ARIA22: Using role=status to present status messages
					 * https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22
					 */}
					<span className={classNames(s.results, s.tablet_up)} role="status">
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
					{tierOptions.map(({ id, label, onChange, selected }: $TSFixMe) => {
						return selected && <Tag key={id} text={label} onRemove={onChange} />
					})}
					{/* Render x-tags for components */}
					{componentOptions.map(
						({ id, label, onChange, selected }: $TSFixMe) => {
							return (
								selected && <Tag key={id} text={label} onRemove={onChange} />
							)
						}
					)}
					{/* Render x-tags for flags */}
					{flagOptions.map(({ id, label, onChange, selected }: $TSFixMe) => {
						return selected && <Tag key={id} text={label} onRemove={onChange} />
					})}

					{atLeastOneFacetSelected ? (
						<Button
							text="Reset filters"
							icon={<IconX16 />}
							color="tertiary"
							size="small"
							className={classNames(s.tablet_up, s.clearFiltersButton)}
							onClick={clearFilters}
						/>
					) : (
						<div className={s.noFilters}>No filters selected</div>
					)}
				</div>
			</div>

			<div className={classNames(s.results, s.mobile_only)}>{resultText}</div>

			<PaginatedIntegrationsList onClearFiltersClicked={clearFilters} />

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
						onClick={clearFilters}
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
	const { componentOptions, flagOptions, tierOptions } =
		useIntegrationsSearchContext()

	return (
		<>
			{[
				{ name: 'Tier', options: tierOptions },
				{ name: 'Component', options: componentOptions },
				{ name: 'Flags', options: flagOptions },
			].map(({ name, options }: $TSFixMe) => {
				return (
					<div key={name} className={s.optionsContainer}>
						<Legend>{name}</Legend>
						{options.map(({ id, label, onChange, selected }: $TSFixMe) => {
							return (
								<CheckboxField
									key={id}
									labelFontWeight="regular"
									label={label}
									checked={selected}
									onChange={onChange}
								/>
							)
						})}
					</div>
				)
			})}
		</>
	)
}
