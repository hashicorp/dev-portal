import {
  HeadingBlockProps,
  TutorialCardsProps,
  CollectionCardsProps,
  LinkedCardsProps,
} from './blocks'

export type ProductLandingBlock =
  | ({ type: 'tutorial_cards' } & TutorialCardsProps)
  | ({ type: 'collection_cards' } & CollectionCardsProps)
  | ({ type: 'linked_cards' } & LinkedCardsProps)
  | ({ type: 'heading' } & HeadingBlockProps)

export interface ProductLandingBlocksProps {
  blocks: ProductLandingBlock[]
}
