import {
  HeadingBlockProps,
  TutorialCardsProps,
  LinkedCardsProps,
} from './blocks'

export type ProductLandingBlock =
  | ({ type: 'tutorial_cards' } & TutorialCardsProps)
  | ({ type: 'linked_cards' } & LinkedCardsProps)
  | ({ type: 'heading' } & HeadingBlockProps)

export interface ProductLandingBlocksProps {
  blocks: ProductLandingBlock[]
}
