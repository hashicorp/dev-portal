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

interface BrandedCalloutBlock extends BrandedCalloutProps {
	type: 'BrandedCallout'
}

interface CardListBlock extends LogoCardListProps {
	type: 'CardList'
}

interface TutorialsStackBlock extends TutorialsStackProps {
	type: 'TutorialsStack'
}

interface CollectionsStackBlock extends CollectionsStackProps {
	type: 'CollectionsStack'
}

export type ProductViewBlock =
	| FeaturedStackBlock
	| BrandedCalloutBlock
	| CardListBlock
	| TutorialsStackBlock
	| CollectionsStackBlock

export interface ProductViewContentProps {
	blocks: ProductViewBlock[]
}
