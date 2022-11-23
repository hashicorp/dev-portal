import CardsGridList from 'components/cards-grid-list'
import {
	CollectionCardPropsWithId,
	CollectionCardWithAuthElements,
} from 'components/collection-card'
import { FeaturedStack } from '../featured-stack'
import { CollectionsStackProps } from './types'

// Reminder:  make sure heap stuff is carried forward
// const HEAP_ID = 'CollectionCard'

function CollectionsStack({
	collectionCards,
	heading,
	headingSlug,
	subheading,
}: CollectionsStackProps): JSX.Element {
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
