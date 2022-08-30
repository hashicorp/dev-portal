import { useHits } from 'react-instantsearch-hooks-web'

import CardsGridList from 'components/cards-grid-list'
import { TutorialCardWithBookmark } from 'components/tutorial-card'
import { getTutorialCardPropsFromHit } from '../../utils/get-tutorial-card-props-from-hit'
import EmptyState from 'components/empty-state'
import { ClearFilters } from '../clear-filters'

/**
 * Renders tutorial search results as a card grid
 */
export function TutorialLibraryResults() {
	const { hits } = useHits()

	if (hits.length === 0) {
		return (
			<EmptyState
				heading="No results"
				subheading="Try adjusting your selected filters or using different keywords"
				callToAction={<ClearFilters color="secondary" />}
			/>
		)
	}

	return (
		<CardsGridList fixedColumns={3}>
			{hits.map((hit) => (
				<TutorialCardWithBookmark
					key={hit.objectID}
					{...getTutorialCardPropsFromHit(hit)}
				/>
			))}
		</CardsGridList>
	)
}
