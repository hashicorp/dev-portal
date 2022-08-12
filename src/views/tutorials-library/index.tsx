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

import { productSlugsToNames } from 'lib/products'

import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import CardsGridList from 'components/cards-grid-list'
import TutorialCard, { TutorialCardProps } from 'components/tutorial-card'
import FilterInput from 'components/filter-input'
import ProductIcon from 'components/product-icon'
import { ProductSlug } from 'types/products'

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
	const { items, refine } = useRefinementList({
		attribute: 'products',
		operator: 'and',
	})

	return (
		<section>
			<span>Product</span>
			<ul>
				{Object.keys(productSlugsToNames).map((slug) => {
					const isProductSelected = items.find(
						({ value }) => value === slug
					)?.isRefined

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
			</ul>
		</section>
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
	const { items, refine } = useMenu({ attribute: 'edition' })

	const isAnyEditionSelected = items.some(({ isRefined }) => isRefined)

	return (
		<section>
			<span>Edition</span>
			<ul>
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
					const isEditionSelected = items.find(
						({ value: val }) => val === value
					)?.isRefined

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
			</ul>
		</section>
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
		<section>
			<span>Resources</span>
			<ul>
				{RESOURCES.map((attribute) => (
					<li key={attribute.attribute}>
						<ToggleRefinement {...attribute} />
					</li>
				))}
			</ul>
		</section>
	)
}

/**
 * List all active filters, removes any given filter on click
 */
export function CurrentFilters() {
	const { items } = useCurrentRefinements()

	if (!items || items.length === 0) {
		return null
	}

	const { refine, refinements } = items[0]

	return (
		<ul>
			{refinements.map((refinement) => {
				const { label } = refinement

				return (
					<li key={label}>
						<button onClick={() => refine(refinement)}>{label} x</button>
					</li>
				)
			})}
		</ul>
	)
}

/**
 *
 * @TODO debounce querying
 * @TODO generate proper tutorial link
 * @TODO persist state to URL
 */
export default function TutorialsLibraryView() {
	const [query, setQuery] = useState<string>()
	const searchState = useInstantSearch()
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
