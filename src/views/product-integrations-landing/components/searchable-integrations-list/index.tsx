/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { IconFilter16 } from '@hashicorp/flight-icons/svg-react/filter-16'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import capitalize from '@hashicorp/platform-util/text/capitalize'
import useTypingDebounce from 'lib/hooks/use-typing-debounce'
import {
	Flag,
	Integration,
	IntegrationComponent,
	IntegrationType,
	Tier,
} from 'lib/integrations-api-client/integration'
import { useIntegrationsSearchContext } from 'views/product-integrations-landing/contexts/integrations-search-context'
import Button from 'components/button'
import Dialog from 'components/dialog'
import { CheckboxField } from 'components/form/field-controls'
import FilterInput from 'components/filter-input'
import Legend from 'components/form/components/legend'
import MultiSelect from 'components/multi-select'
import Tag from 'components/tag'
import PaginatedIntegrationsList from '../paginated-integrations-list'
import { integrationLibrarySearchedEvent } from './helpers/analytics'
import s from './style.module.css'

interface SearchableIntegrationsListProps {
	className: string
}

// Returns logical sort ordering of a Tier
const getTierSortValue = (tier: Tier): number => {
	switch (tier) {
		case Tier.OFFICIAL:
			return 1
		case Tier.PARTNER:
			return 2
		case Tier.COMMUNITY:
		default:
			return 3
	}
}

export default function SearchableIntegrationsList({
	className,
}: SearchableIntegrationsListProps) {
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
	const {
		atLeastOneFacetSelected,
		clearFilters,
		filteredIntegrations,
		integrations,
		isLoading,
		queryParams,
		resetPage,
		setFilterQuery,
		toggleComponentChecked,
		toggleFlagChecked,
		toggleTierChecked,
		toggleTypeChecked,
	} = useIntegrationsSearchContext()

	const { allComponents, allFlags, allTiers, allTypes } = useMemo(() => {
		/**
		 * Get each facet's unique set of values.
		 */
		const componentsById: Record<
			IntegrationComponent['id'],
			IntegrationComponent
		> = {}
		const flagsById: Record<Flag['id'], Flag> = {}
		const tiersSet = new Set<Tier>()
		const typesById = new Set<IntegrationType>()
		integrations.forEach((integration: Integration) => {
			integration.components.forEach((component: IntegrationComponent) => {
				if (!componentsById[component.id]) {
					componentsById[component.id] = component
				}
			})
			integration.flags.forEach((flag: Flag) => {
				if (!flagsById[flag.id]) {
					flagsById[flag.id] = flag
				}
			})
			tiersSet.add(integration.tier)

			const integrationType = integration.integration_type
			if (integrationType && !typesById[integrationType.id]) {
				typesById[integrationType.id] = integrationType
			}
		})

		/**
		 * Create flat, sorted arrays of objects for each facet.
		 *
		 * @TODO is the `occurances` property needed on each `IntegrationComponent`?
		 */
		const allComponents = Object.values(componentsById).sort(
			(a: IntegrationComponent, b: IntegrationComponent) => {
				const aName = a.name.toLowerCase()
				const bName = b.name.toLowerCase()
				if (aName < bName) {
					return -1
				}
				if (aName > bName) {
					return 1
				}
				return 0
			}
		)
		const allFlags = Object.values(flagsById).sort((a: Flag, b: Flag) => {
			const aName = a.name.toLowerCase()
			const bName = b.name.toLowerCase()
			if (aName < bName) {
				return -1
			}
			if (aName > bName) {
				return 1
			}
			return 0
		})
		const allTiers = Array.from(tiersSet).sort((a: Tier, b: Tier) => {
			const aTierSortValue = getTierSortValue(a)
			const bTierSortValue = getTierSortValue(b)
			if (aTierSortValue < bTierSortValue) {
				return -1
			}
			if (aTierSortValue > bTierSortValue) {
				return 1
			}
			return 0
		})
		// @TODO should these be sorted? Not currently done in prod
		const allTypes = Object.values(typesById).sort(
			(a: IntegrationType, b: IntegrationType) => {
				const aName = a.plural_name.toLowerCase()
				const bName = b.plural_name.toLowerCase()
				if (aName < bName) {
					return -1
				}
				if (aName > bName) {
					return 1
				}
				return 0
			}
		)

		return {
			allComponents,
			allFlags,
			allTiers,
			allTypes,
		}
	}, [integrations])

	/**
	 * Create arrays of options for each facet.
	 */
	const { componentOptions, flagOptions, tierOptions, typeOptions } =
		useMemo(() => {
			return {
				componentOptions: allComponents.map(
					(component: IntegrationComponent) => {
						return {
							id: component.slug,
							label: capitalize(component.plural_name),
							onChange: () => {
								resetPage()
								toggleComponentChecked(component)
							},
							selected: queryParams.components.includes(component.slug),
						}
					}
				),
				flagOptions: allFlags.map((flag: Flag) => {
					return {
						id: flag.slug,
						label: flag.name,
						onChange: () => {
							resetPage()
							toggleFlagChecked(flag)
						},
						selected: queryParams.flags.includes(flag.slug),
					}
				}),
				tierOptions: allTiers.map((tier: Tier) => {
					return {
						id: tier,
						label: capitalize(tier),
						onChange: () => {
							resetPage()
							toggleTierChecked(tier)
						},
						selected: queryParams.tiers.includes(tier),
					}
				}),
				typeOptions: allTypes.map((type: IntegrationType) => {
					return {
						id: type.slug,
						label: type.plural_name,
						onChange: () => {
							resetPage()
							toggleTypeChecked(type)
						},
						selected: queryParams.types.includes(type.slug),
					}
				}),
			}
		}, [
			allComponents,
			allFlags,
			allTiers,
			allTypes,
			queryParams,
			resetPage,
			toggleComponentChecked,
			toggleFlagChecked,
			toggleTierChecked,
			toggleTypeChecked,
		])

	/**
	 * Track an "integration_library_searched" event when the
	 * queryParams.filterQuery changes.
	 *
	 * Note: we only want to track this event if the query input is meaningful.
	 * We consider query input lengths of more than 2 characters to be meaningful
	 * (in fact, we don't filter results unless the query is > 2 chars long).
	 *
	 * Note as well that we useTypingDebounce here to reduce the number of events.
	 * Without useTypingDebounce, an event would fire on every character typed.
	 */
	const searchedEventCallback = useCallback(() => {
		if (queryParams.filterQuery.length > 2) {
			integrationLibrarySearchedEvent({
				search_query: queryParams.filterQuery,
				results_count: filteredIntegrations.length,
			})
		}
	}, [queryParams.filterQuery, filteredIntegrations.length])
	useTypingDebounce(searchedEventCallback)

	/**
	 * @TODO replace with actual loading skeleton (currently on different branch)
	 */
	if (isLoading) {
		return <h1>Loading...</h1>
	}

	const resultText = `${filteredIntegrations.length} ${
		filteredIntegrations.length === 1 ? 'result found' : 'results found'
	}`
	return (
		<div className={classNames(s.searchableIntegrationsList, className)}>
			<div className={s.header}>
				<FilterInput
					className={s.filterInput}
					IconComponent={IconSearch16}
					value={queryParams.filterQuery}
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
						<MultiSelect text="Types" options={typeOptions} />
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
					{/* Render x-tags for types */}
					{typeOptions.map(({ id, label, onChange, selected }: $TSFixMe) => {
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
					<MobileFilters
						componentOptions={componentOptions}
						flagOptions={flagOptions}
						tierOptions={tierOptions}
						typeOptions={typeOptions}
					/>
				</div>
			</Dialog>
		</div>
	)
}

// Renders Tier/Component/Flags checkboxes
function MobileFilters({
	componentOptions,
	flagOptions,
	tierOptions,
	typeOptions,
}: $TSFixMe) {
	return (
		<>
			{[
				{ name: 'Tier', options: tierOptions },
				{ name: 'Component', options: componentOptions },
				{ name: 'Flags', options: flagOptions },
				{ name: 'Types', options: typeOptions },
			].map(({ name, options }: $TSFixMe) => {
				if (!options.length) {
					return null
				}

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
