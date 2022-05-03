import {
  InlineCollections,
  InlineTutorials,
} from 'views/product-tutorials-view/helpers/get-inline-content'
import {
  BrandedCalloutProps,
  LogoCardListItem,
  FeaturedStackProps,
  CollectionsStackProps,
  TutorialsStackProps,
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

interface LogoCardBlock extends Pick<LogoCardListItem, 'logo'> {
  type: 'LogoCard'
  /** A single collection identifier string, which will be filled in
   * using fetched inlineCollections data */
  collectionSlug: string
}

type CardListBlock = {
  type: 'CardList'
  items: LogoCardBlock[]
}

interface TutorialsStackBlock
  extends Omit<TutorialsStackProps, 'featuredTutorials'> {
  type: 'TutorialsStack'
  /** Tutorial identifier strings, which will be filled in
   * using fetched inlineCollections data */
  tutorialSlugs: string[]
}

interface CollectionsStackBlock
  extends Omit<CollectionsStackProps, 'featuredCollections'> {
  type: 'CollectionsStack'
  /** Collection identifier strings, which will be filled in
   * using fetched inlineCollections data */
  collectionSlugs: string[]
}

export type ProductViewBlock =
  | FeaturedStackBlock
  | BrandedCalloutBlock
  | CardListBlock
  | TutorialsStackBlock
  | CollectionsStackBlock

export interface ProductViewContentProps {
  blocks: ProductViewBlock[]
  inlineCollections: InlineCollections
  inlineTutorials: InlineTutorials
}
