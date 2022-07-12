import { TutorialCardPropsWithId } from 'components/tutorial-card/types'

export interface CollectionTutorialListProps {
  tutorials: TutorialCardPropsWithId[]
  isOrdered: boolean
}
