import {
	BrandedCalloutProps,
	FeaturedStackProps,
	CollectionsStackProps,
	TutorialsStackProps,
	LogoCardListProps,
} from './components'

interface FeaturedStackBlock extends Omit<FeaturedStackProps, 'children'> {
	type: 'FeaturedStack'
	/** Note that only CardLists are supported for authorable use in FeaturedStack.
	 * We may choose to change the CardList block to use FeaturedStack under the
	 * hood, as we've done for TutorialsStack & CollectionsStack.
	 */
	blocks: CardListBlock[]
}

interface CardListBlock extends LogoCardListProps {
	type: 'CardList'
}

export type ProductViewBlock =
	| FeaturedStackBlock
	| CardListBlock
	| ({ type: 'BrandedCallout' } & BrandedCalloutProps)
	| ({ type: 'TutorialsStack' } & TutorialsStackProps)
	| ({ type: 'CollectionsStack' } & CollectionsStackProps)

export interface ProductViewContentProps {
	blocks: $TSFixMe[]
}
