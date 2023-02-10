import CardsGridList from 'components/cards-grid-list'
import {
	CollectionCardPropsWithId,
	CollectionCardWithAuthElements,
} from 'components/collection-card'
import { Section, SectionProps } from '../section'

interface CollectionCardGridBlockProps
	extends Pick<SectionProps, 'heading' | 'subheading'> {
	collections: CollectionCardPropsWithId[]
}

const CollectionCardGridBlock = ({
	heading,
	subheading,
	collections,
}: CollectionCardGridBlockProps) => {
	return (
		<Section heading={heading} subheading={subheading}>
			<CardsGridList>
				{collections.map((collection: CollectionCardPropsWithId) => {
					return (
						<CollectionCardWithAuthElements
							key={collection.id}
							{...collection}
						/>
					)
				})}
			</CardsGridList>
		</Section>
	)
}

export type { CollectionCardGridBlockProps }
export { CollectionCardGridBlock }
