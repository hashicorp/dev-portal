import classNames from 'classnames'
import { useCurrentRefinements } from 'react-instantsearch-hooks-web'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'

import { productSlugsToNames } from 'lib/products'
import currentFiltersStyle from './current-filters.module.css'
import { EDITIONS, RESOURCES } from '../../constants'

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

						if (attribute === 'edition') {
							const edition = EDITIONS.find(
								(edition) => edition.value === label
							)
							labelText = edition.label
						}

						if (attribute === 'products') {
							labelText = productSlugsToNames[label]
						}

						return (
							<li key={labelText}>
								<button
									onClick={() => item.refine(refinement)}
									className={currentFiltersStyle.filterButton}
									aria-label={`Remove filter ${labelText}`}
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
