import { useState } from 'react'
import {
	useInstantSearch,
	useSearchBox,
	useHits,
	useRefinementList,
	useToggleRefinement,
	useMenu,
	useCurrentRefinements,
} from 'react-instantsearch-hooks-web'
import classNames from 'classnames'

import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'

import { productSlugsToNames } from 'lib/products'

import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import CardsGridList from 'components/cards-grid-list'
import TutorialCard, { TutorialCardProps } from 'components/tutorial-card'
import FilterInput from 'components/filter-input'
import ProductIcon from 'components/product-icon'
import { ProductSlug } from 'types/products'

import filterSectionStyle from './filter-section.module.css'
import currentFiltersStyle from './current-filters.module.css'

/**
 * Results
 */
function getTutorialCardPropsFromHit(hit): TutorialCardProps {
	return {
		url: hit.slug,
		duration: getReadableTime(hit.readTime),
		heading: hit.name,
		description: hit.description,
		productsUsed: hit.products,
		hasVideo: hit.hasVideo,
		hasInteractiveLab: hit.isInteractive,
	}
}

/**
 *
 * @TODO fix URL to be correct for devdot
 */
function Results() {
	const { hits } = useHits()

	return (
		<CardsGridList fixedColumns={3}>
			{hits.map((hit) => (
				<TutorialCard
					key={hit.objectID}
					{...getTutorialCardPropsFromHit(hit)}
				/>
			))}
		</CardsGridList>
	)
}

/**
 * Refinements
 */
export function ProductFilter() {
	const { refine } = useRefinementList({
		attribute: 'products',
		operator: 'and',
	})

	const { indexUiState } = useInstantSearch()
	const selectedProducts = indexUiState?.refinementList?.products ?? []

	return (
		<FilterSection heading="Product">
			{Object.keys(productSlugsToNames).map((slug) => {
				const isProductSelected = selectedProducts.includes(slug)

				const productName = productSlugsToNames[slug]

				return (
					<li key={slug}>
						<input
							type="checkbox"
							name={slug}
							checked={isProductSelected}
							onChange={() => {
								refine(slug)
							}}
						/>
						<ProductIcon productSlug={slug as ProductSlug} />
						{productName}
					</li>
				)
			})}
		</FilterSection>
	)
}

const EDITIONS = [
	{ value: 'open_source', label: 'Open Source' },
	{ value: 'enterprise', label: 'Enterprise' },
	{ value: 'tfc', label: 'Terraform Cloud' },
	{ value: 'hcp', label: 'HashiCorp Cloud Platform (HCP)' },
]

/**
 * @TODO abstract the radio input to reduce duplication here
 */
export function EditionFilter() {
	const { refine } = useMenu({ attribute: 'edition' })

	const { indexUiState } = useInstantSearch()
	const selectedAddition = indexUiState?.menu?.edition

	const isAnyEditionSelected = selectedAddition !== undefined

	return (
		<FilterSection heading="Edition">
			<li>
				<label htmlFor="all">
					<input
						type="radio"
						radioGroup="edition"
						name={'All'}
						checked={!isAnyEditionSelected}
						onChange={() => refine(null)}
					/>
					<span>All</span>
				</label>
			</li>
			{EDITIONS.map(({ value, label }) => {
				const isEditionSelected = value === selectedAddition

				return (
					<li key={value}>
						<label htmlFor={value}>
							<input
								type="radio"
								radioGroup="edition"
								name={value}
								checked={isEditionSelected}
								onChange={() => refine(value)}
							/>
							<span>{label}</span>
						</label>
					</li>
				)
			})}
		</FilterSection>
	)
}

function ToggleRefinement({ attribute, label }) {
	const { value, refine } = useToggleRefinement({ attribute })

	return (
		<label htmlFor={label}>
			<input
				type="checkbox"
				name={label}
				checked={value.isRefined}
				onChange={() => {
					refine({ isRefined: value.isRefined })
				}}
			/>
			<span>{label}</span>
		</label>
	)
}

const RESOURCES = [
	{
		label: 'Video',
		attribute: 'hasVideo',
	},
	{ label: 'Interactive', attribute: 'isInteractive' },
]

export function ResourcesFilter() {
	return (
		<FilterSection heading="Resources">
			{RESOURCES.map((attribute) => (
				<li key={attribute.attribute}>
					<ToggleRefinement {...attribute} />
				</li>
			))}
		</FilterSection>
	)
}

/**
 * List all active filters, removes any given filter on click
 */
export function CurrentFilters() {
	const { items } = useCurrentRefinements()

	const hasAppliedFilters = items && items.length > 0

	return (
		<div
			className={classNames(
				currentFiltersStyle.root,
				hasAppliedFilters && currentFiltersStyle.hasFilters
			)}
		>
			<span className={currentFiltersStyle.label}>Filters:</span>
			<ul>
				{items.flatMap((item) => {
					return item.refinements.map((refinement) => {
						const { label, type, attribute } = refinement

						let labelText = label
						// This is a "Resource" filter
						if (type === 'disjunctive') {
							const resource = RESOURCES.find(
								(resource) => resource.attribute === attribute
							)
							labelText = resource.label
						}

						return (
							<li key={labelText}>
								<button
									onClick={() => item.refine(refinement)}
									className={currentFiltersStyle.filterButton}
								>
									{labelText} <IconX16 />
								</button>
							</li>
						)
					})
				})}
			</ul>
		</div>
	)
}

function FilterSection({ heading, children }) {
	return (
		<section className={filterSectionStyle.root}>
			<span className={filterSectionStyle.heading}>{heading}</span>
			<ul className={filterSectionStyle.filterList}>{children}</ul>
		</section>
	)
}

/**
 *
 * @TODO debounce querying
 * @TODO generate proper tutorial link
 * @TODO persist state to URL
 * @TODO no results state
 * @TODO filter styling
 */
export default function TutorialsLibraryView() {
	const [query, setQuery] = useState<string>()
	const { refine } = useSearchBox()

	return (
		<div>
			<h1>Tutorial Library</h1>
			<FilterInput
				placeholder="Filter results"
				value={query}
				onChange={(value) => {
					setQuery(value)
					refine(value)
				}}
			/>
			<CurrentFilters />
			<Results />
		</div>
	)
}
