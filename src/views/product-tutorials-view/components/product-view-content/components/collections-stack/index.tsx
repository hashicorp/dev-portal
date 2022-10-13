import CardsGridList from 'components/cards-grid-list'
import CollectionCard, {
	CollectionCardPropsWithId,
	CollectionCardWithAuthElements,
} from 'components/collection-card'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { FeaturedStack } from '../featured-stack'
import { CollectionsStackProps } from './types'

// Reminder:  make sure heap stuff is carried forward
// const HEAP_ID = 'CollectionCard'

function CollectionsStack({
	featuredCollections,
	heading,
	headingSlug,
	subheading,
}: CollectionsStackProps): JSX.Element {
	/**
	 * TODO: Instead of passing full ClientCollection data to frontend,
	 * and trimming it down here to card data, it seems like we could
	 * do this trimming server side, and end up with a much smaller
	 * bundle of static props JSON.
	 * Asana task: https://app.asana.com/0/0/1202182325935203/f
	 */
	const collectionCards = featuredCollections.map(formatCollectionCard)
	return (
		<FeaturedStack
			heading={heading}
			headingSlug={headingSlug}
			subheading={subheading}
		>
			<CardsGridList>
				{collectionCards.map((cardPropsWithId: CollectionCardPropsWithId) => {
					return (
						<li key={cardPropsWithId.id}>
							<CollectionCardWithAuthElements {...cardPropsWithId} />
						</li>
					)
				})}
			</CardsGridList>
		</FeaturedStack>
	)
}

export type { CollectionsStackProps }
export { CollectionsStack }
