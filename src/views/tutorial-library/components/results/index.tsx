import { useHits } from 'react-instantsearch-hooks-web'

import CardsGridList from 'components/cards-grid-list'
import { TutorialCardWithBookmark } from 'components/tutorial-card'
import { getTutorialCardPropsFromHit } from '../../utils/get-tutorial-card-props-from-hit'

/**
 * Renders tutorial search results as a card grid
 */
export function TutorialLibraryResults() {
	const { hits } = useHits()

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
